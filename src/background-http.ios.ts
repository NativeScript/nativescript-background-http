import { Observable } from "tns-core-modules/data/observable";
import * as common from "./index";
import * as fileSystemModule from "tns-core-modules/file-system";

const main_queue = dispatch_get_current_queue();
let zonedOnProgress = null;
let zonedOnError = null;

function onProgress(nsSession, nsTask, sent, expectedTotal) {
    const task = Task.getTask(nsSession, nsTask);
    task.notifyPropertyChange("upload", task.upload);
    task.notifyPropertyChange("totalUpload", task.totalUpload);
    task.notify(<common.ProgressEventData>{
        eventName: "progress",
        object: task,
        currentBytes: sent,
        totalBytes: expectedTotal
    });
}

function onError(session, nsTask, error) {
    const task = Task.getTask(session, nsTask);
    if (task._fileToCleanup) {
        NSFileManager.defaultManager.removeItemAtPathError(task._fileToCleanup);
    }
    const response = nsTask && <NSHTTPURLResponse>nsTask.performSelector("response");
    if (error) {
        task.notifyPropertyChange("status", task.status);
        task.notify(<common.ErrorEventData>{
            eventName: "error",
            object: task,
            error,
            responseCode: response ? response.statusCode : -1,
            response
        });
    } else {
        task.notifyPropertyChange("upload", task.upload);
        task.notifyPropertyChange("totalUpload", task.totalUpload);
        task.notify(<common.ProgressEventData>{
            eventName: "progress",
            object: task,
            currentBytes: nsTask.countOfBytesSent,
            totalBytes: nsTask.countOfBytesExpectedToSend
        });
        task.notify(<common.CompleteEventData>{
            eventName: "complete",
            object: task,
            responseCode: response ? response.statusCode : -1,
            response
        });

        Task._tasks.delete(nsTask);
    }
}

function getAssetData(asset: string, fileHandle: NSFileHandle = null): Promise<any> {
    let handle = fileHandle, opened = false;
    const fileName = fileSystemModule.knownFolders.documents().path + "/temp-MPA-" + Math.floor(Math.random() * 100000000000) + ".tmp";
    if (fileHandle == null) {
        NSFileManager.defaultManager.createFileAtPathContentsAttributes(fileName, null, null);
        handle = NSFileHandle.fileHandleForWritingAtPath(fileName);
        opened = true;
    } else {
        handle.seekToEndOfFile();
    }
    if (!handle) {
        return Promise.resolve(null);
    }

    return new Promise(resolve => {

        // Get the Asset
        PHPhotoLibrary.requestAuthorization( (status) => {
            if (status !== PHAuthorizationStatus.Authorized) {
                return resolve(null);
            }
            const nurl = NSURL.URLWithString(asset);
            const assets = PHAsset.fetchAssetsWithALAssetURLsOptions(NSArray.arrayWithArray([nurl]), null);

            // No Asset matching
            if (assets.count == 0) {
                let isWritten = false;
                if (opened) {
                    handle.closeFile();
                    opened = false;
                }
                try {
                    isWritten = NSFileManager.defaultManager.copyItemAtURLToURLError(nurl, NSURL.fileURLWithPath(fileName));
                } catch (err) {
                    // Do Nothing....
                }
                return resolve(isWritten ? fileName : null);
            }

            if (assets[0].mediaType === PHAssetMediaTypeImage) {
                const options = PHImageRequestOptions.alloc().init();
                options.synchronous = true;
                options.isNetworkAccessAllowed = true;
                PHImageManager.defaultManager().requestImageDataForAssetOptionsResultHandler(assets[0], options, function (imageData, dataUTI, orientation, info) {
                    handle.writeData(imageData);
                    handle.synchronizeFile();
                    if (opened) {
                        handle.closeFile();
                    }
                    resolve(fileName);
                });
                return;
            } else if (assets[0].mediaType === PHAssetMediaTypeVideo) {
                const options = PHVideoRequestOptions.alloc().init();
                options.version = PHVideoRequestOptionsVersionOriginal;
//                options.deliveryMode = PHVideoRequestOptionsDeliveryMode.HighQualityFormat;

                PHImageManager.defaultManager().requestAVAssetForVideoOptionsResultHandler(assets[0], options, function (asset, audioMix, info) {
                    handle.writeData(NSData.dataWithContentsOfURL(asset.URL));
                    handle.synchronizeFile();
                    if (opened) {
                        handle.closeFile();
                    }
                    resolve(fileName);
                });
            } else {
                if (opened) {
                    handle.closeFile();
                }
                let fURL = NSURL.fileURLWithPath(fileName);
                let written = NSFileManager.defaultManager.copyItemAtURLToURLError(nurl, fURL);
                if (opened) {
                    opened = false;
                } else {
                    handle.writeData(NSData.dataWithContentsOfURL(fURL));
                }
                resolve(fileName);
            }
        });
    });
}

class BackgroundUploadDelegate extends NSObject implements NSURLSessionDelegate, NSURLSessionTaskDelegate, NSURLSessionDataDelegate, NSURLSessionDownloadDelegate {

    static ObjCProtocols = [NSURLSessionDelegate, NSURLSessionTaskDelegate, NSURLSessionDataDelegate, NSURLSessionDownloadDelegate];

    // NSURLSessionDelegate
    URLSessionDidBecomeInvalidWithError(session, error) {
    }

    URLSessionDidReceiveChallengeCompletionHandler(session, challenge, comlpetionHandler) {
        const disposition = null;
        const credential = null;
        comlpetionHandler(disposition, credential);
    }

    URLSessionDidFinishEventsForBackgroundURLSession(session) {
    }

    // NSURLSessionTaskDelegate
    URLSessionTaskDidCompleteWithError(session: NSURLSession, nsTask: NSURLSessionTask, error: NSError) {
        dispatch_async(main_queue, () => {
            zonedOnError(session, nsTask, error);
        });
    }

    URLSessionTaskDidReceiveChallengeCompletionHandler(session, task, challenge, completionHandler) {
        const disposition = null;
        const credential = null;
        completionHandler(disposition, credential);
    }

    URLSessionTaskDidSendBodyDataTotalBytesSentTotalBytesExpectedToSend(nsSession: NSURLSession, nsTask: NSURLSessionTask, data, sent: number, expectedTotal: number) {
        dispatch_async(main_queue, () => {
            zonedOnProgress(nsSession, nsTask, sent, expectedTotal);
        });
    }

    URLSessionTaskNeedNewBodyStream(session, task, need) {
    }

    URLSessionTaskWillPerformHTTPRedirectionNewRequestCompletionHandler(session, task, redirect, request, completionHandler) {
        completionHandler(request);
    }

    // NSURLSessionDataDelegate
    URLSessionDataTaskDidReceiveResponseCompletionHandler(session, dataTask, response, completionHandler) {
        const disposition = null;
        completionHandler(disposition);
    }

    URLSessionDataTaskDidBecomeDownloadTask(session, dataTask, downloadTask) {
    }

    URLSessionDataTaskDidReceiveData(session: NSURLSession, dataTask: NSURLSessionDataTask, data: NSData) {
        dispatch_async(main_queue, () => {
            // we have a response in the data...
            const jsTask = Task.getTask(session, dataTask);
            const jsonString = NSString.alloc().initWithDataEncoding(data, NSUTF8StringEncoding);

            jsTask.notify(<common.ResultEventData>{
                eventName: "responded",
                object: jsTask,
                data: jsonString.toString(),
                responseCode: dataTask && dataTask.response ? (<NSHTTPURLResponse>dataTask.response).statusCode : -1
            });
        });
    }

    URLSessionDataTaskWillCacheResponseCompletionHandler() {
    }

    // NSURLSessionDownloadDelegate
    URLSessionDownloadTaskDidResumeAtOffsetExpectedTotalBytes(session, task, offset, expects) {
    }

    URLSessionDownloadTaskDidWriteDataTotalBytesWrittenTotalBytesExpectedToWrite(session, task, data, written, expected) {
    }

    URLSessionDownloadTaskDidFinishDownloadingToURL(session, task, url) {
    }
}

class Session implements common.Session {
    // TODO: Create a mechanism to clean sessions from the cache that have all their tasks completed, canceled or errored out.
    private static _sessions: { [id: string]: Session } = {};

    private _session: NSURLSession;

    constructor(id: string) {
        const delegate = BackgroundUploadDelegate.alloc().init();
        const configuration = NSURLSessionConfiguration.backgroundSessionConfigurationWithIdentifier(id);
        this._session = NSURLSession.sessionWithConfigurationDelegateDelegateQueue(configuration, delegate, null);
        zonedOnProgress = global.zonedCallback(onProgress);
        zonedOnError = global.zonedCallback(onError);
    }

    get ios(): any {
        return this._session;
    }

    public uploadFile(fileUri: string, options: common.Request): Promise<common.Task> {
        if (!fileUri) {
            throw new Error("File must be provided.");
        }

        const url = NSURL.URLWithString(options.url);
        const request = NSMutableURLRequest.requestWithURL(url);

        const headers = options.headers;
        if (headers) {
            for (let header in headers) {
                const value = headers[header];
                if (value !== null && value !== void 0) {
                    request.setValueForHTTPHeaderField(value.toString(), header);
                }
            }
        }

        if (options.method) {
            request.HTTPMethod = options.method;
        }

        let fileURL: NSURL;
        const handleUpload = (fileURL: string, deleteAfter: boolean, resolve) => {
            console.log("In Handle", fileURL);
            const newTask = this._session.uploadTaskWithRequestFromFile(request, fileURL);
            newTask.taskDescription = options.description;
            newTask.resume();
            const retTask: common.Task = <any>Task.getTask(this._session, newTask);
            if (deleteAfter) {
                console.log("Setting Cleanup");
                (<any>retTask)._fileToCleanup = fileURL;
            }
            console.log("Done");
            resolve(retTask);
        };

        return new Promise( (resolve) => {
            if (fileUri.startsWith("file://")) {
                // File URI in string format
                fileURL = NSURL.URLWithString(fileUri);
                handleUpload(fileURL, false, resolve);
            } else if (fileUri.charAt(0) === "/") {
                // Absolute path with leading slash
                fileURL = NSURL.fileURLWithPath(fileUri);
                handleUpload(fileURL, false, resolve);
            } else if (fileUri.startsWith("assets-library://")) {
                getAssetData(fileUri).then(fileName => {
                    console.log("Back from GAD", fileName);
                    if (fileName == null) {
                        return resolve(null);
                    }
                    fileURL = NSURL.fileURLWithPath(fileName);
                    handleUpload(fileURL, true, resolve);
                }).catch(err => {
                    console.log("Error in uploadFile", err);
                    resolve(null);
                });
            }

        });
    }

    public multipartUpload(params: any[], options: any): Promise<common.Task> {
        const MPF = new MultiMultiPartForm();

        return new Promise( (resolve) => {
            for (let i = 0; i < params.length; i++) {
                const curParam = params[i];
                if (typeof curParam.name === 'undefined') {
                    throw new Error("You must have a `name` value");
                }

                if (curParam.filename) {
                    const destFileName = curParam.destFilename || curParam.filename.substring(curParam.filename.lastIndexOf('/') + 1, curParam.filename.length);
                    MPF.appendParam(curParam.name, null, curParam.filename, curParam.mimeType, destFileName);
                } else {
                    MPF.appendParam(curParam.name, curParam.value);
                }
            }
            const header = MPF.getHeader();
            MPF.generateFile().then( (uploadFileName: string) => {
                if (!options.headers) {
                    options.headers = {};
                }
                options.headers['Content-Type'] = header['Content-Type'];

                this.uploadFile(uploadFileName, options).then(task => {
                    // Tag the file to be deleted and cleanup after upload
                    (<any>task)._fileToCleanup = uploadFileName;
                    resolve(task);
                });
            }).catch((err) => {
                console.log("Error", err, err.stack);
            });
        });
    }
    static getSession(id: string): common.Session {
        let jsSession = Session._sessions[id];
        if (jsSession) {
            return jsSession;
        }
        jsSession = new Session(id);
        Session._sessions[id] = jsSession;
        return jsSession;
    }
}

class NativePropertyReader {
    private _invocationCache = new Map<string, NSInvocation>();

    private getInvocationObject(object: NSObject, selector: string): NSInvocation {
        let invocation = this._invocationCache.get(selector);
        if (!invocation) {
            const sig = object.methodSignatureForSelector(selector);
            invocation = NSInvocation.invocationWithMethodSignature(sig);
            invocation.selector = selector;

            this._invocationCache[selector] = invocation;
        }

        return invocation;
    }

    public readProp<T>(object: NSObject, prop: string, type: interop.Type<T>): T {
        const invocation = this.getInvocationObject(object, prop);
        invocation.invokeWithTarget(object);

        const ret = new interop.Reference<T>(type, new interop.Pointer());
        invocation.getReturnValue(ret);

        return ret.value;
    }
}

class Task extends Observable {
    public static _tasks = new Map<NSURLSessionTask, Task>();
    public static tasksReader = new NativePropertyReader();
    private static is64BitArchitecture = interop.sizeof(interop.types.id) === 8;
    public static NSIntegerType = Task.is64BitArchitecture ? interop.types.int64 : interop.types.int32;

    public _fileToCleanup: string;
    private _task: NSURLSessionTask;
    private _session: NSURLSession;
    private _canceled: boolean = false;

    constructor(nsSession: NSURLSession, nsTask: NSURLSessionTask) {
        super();
        this._task = nsTask;
        this._session = nsSession;
    }

    get ios(): any {
        return this._task;
    }

    get description(): string {
        return this._task.taskDescription;
    }

    get upload(): number {
        return Task.tasksReader.readProp(this._task, "countOfBytesSent", interop.types.int64);
    }

    get totalUpload(): number {
        return Task.tasksReader.readProp(this._task, "countOfBytesExpectedToSend", interop.types.int64);
    }

    get status(): string {
        if (Task.tasksReader.readProp(this._task, "error", Task.NSIntegerType)) {
            return "error";
        }
        // NSURLSessionTaskState : NSInteger, so we should pass number format here
        switch (Task.tasksReader.readProp(this._task, "state", Task.NSIntegerType) as NSURLSessionTaskState) {
            case NSURLSessionTaskState.Running: return "uploading";
            case NSURLSessionTaskState.Completed: return "complete";
            case NSURLSessionTaskState.Canceling: return "error";
            case NSURLSessionTaskState.Suspended: return "pending";
        }
    }

    public static getTask(nsSession: NSURLSession, nsTask: NSURLSessionTask): Task {
        let task = Task._tasks.get(nsTask);
        if (task) {
            return task;
        }

        task = new Task(nsSession, nsTask);
        Task._tasks.set(nsTask, task);

        return task;
    }

    public cancel(): void {
        this._task.cancel();
    }
}

export function session(id: string): common.Session {
    return Session.getSession(id);
}

class MultiMultiPartForm {
    private boundary: string;
    private header: any;
    private fileCount: number;
    private fields: Array<any>;

    constructor() {
        this.clear();
    }

    public clear(): void {
        this.boundary = "--------------formboundary" + Math.floor(Math.random() * 100000000000);
        this.header = { "Content-Type": 'multipart/form-data; boundary=' + this.boundary };
        this.fileCount = 0;
        this.fields = [];
    }

    public appendParam(name: string, value: string, filename?: string, mimeType?: string, destFileName?: string): void {
        // If all we are doing is passing a field, we just add it to the fields list
        if (filename == null) {
            this.fields.push({ name: name, value: value });
            return;
        }
        // Load file
        mimeType = mimeType || "application/data";

        if (filename.startsWith("~/")) {
            filename = filename.replace("~/", fileSystemModule.knownFolders.currentApp().path + "/");
        }

        const finalName = destFileName || filename.substr(filename.lastIndexOf('/') + 1, filename.length);
        this.fields.push({ name: name, filename: filename, destFilename: finalName, mimeType: mimeType });
    }

    private _appendStringData(stringData: string, fileHandle: NSFileHandle) {
        const tempString = NSString.stringWithString(stringData);
        const newData = tempString.dataUsingEncoding(NSUTF8StringEncoding);
        fileHandle.writeData(newData);
    }

    private _copyAsset(asset, fileHandle=null): string {
        let handle = fileHandle, opened=false;
        const fileName = fileSystemModule.knownFolders.documents().path + "/temp-MPA-" + Math.floor(Math.random() * 100000000000) + ".tmp";
        if (fileHandle == null) {
            NSFileManager.defaultManager.createFileAtPathContentsAttributes(fileName, null, null);
            handle = NSFileHandle.fileHandleForWritingAtPath(fileName);
            opened = true;
        } else {
            handle.seekToEndOfFile();
        }
        if (!handle) { return null; }

        const BufferSize = 1024*1024;

        const rep = asset.defaultRepresentation;
        const buffer = calloc(BufferSize, 1);
        let offset=0, bytesRead=0;
        try {
            do {
                try {
                    bytesRead = asset.defaultRepresentation.getBytesFromOffsetLengthError(buffer, offset, BufferSize, null);
                    handle.writeData(NSData.dataWithBytesNoCopyLengthFreeWhenDone(buffer, bytesRead, false));
                    offset += bytesRead;
                } catch (err) {
                    return null;
                }
            } while (bytesRead > 0);
            return fileName;
        } finally {
            if (opened) {
                handle.closeFile();
            }
            free(buffer);
        }
    }

    public generateFile(): Promise<string> {
        const CRLF = "\r\n";

        const fileName = fileSystemModule.knownFolders.documents().path + "/temp-MPF-" + Math.floor(Math.random() * 100000000000) + ".tmp";
        NSFileManager.defaultManager.createFileAtPathContentsAttributes(fileName, null, null);
        let handle = NSFileHandle.fileHandleForWritingAtPath(fileName);

        return new Promise(  async (resolve) => {
            let results = "";
            for (let i = 0; i < this.fields.length; i++) {
                results += "--" + this.boundary + CRLF;
                results += 'Content-Disposition: form-data; name="' + this.fields[i].name + '"';
                if (!this.fields[i].filename) {
                    results += CRLF + CRLF + this.fields[i].value + CRLF;
                } else {
                    results += '; filename="' + this.fields[i].destFilename + '"';
                    if (this.fields[i].mimeType) {
                        results += CRLF + "Content-Type: " + this.fields[i].mimeType;
                    }
                    results += CRLF + CRLF;
                }

                this._appendStringData(results, handle);
                results = "";


                if (this.fields[i].filename) {
                    let fileData;
                    if (this.fields[i].filename.startsWith("assets-library://")) {
                        await getAssetData(this.fields[i].filename, handle);
                        console.log("Done awaiting")
                    } else {
//                        this._copyAsset(this.fields[i].filename, handle);
                        const fileData = NSData.alloc().initWithContentsOfFile(this.fields[i].filename);
                        handle.writeData(fileData);
                    }
                    results = CRLF;
                }

            }
            // Add final part of it...
            results += "--" + this.boundary + "--" + CRLF;
            this._appendStringData(results, handle);
            handle.closeFile();

            resolve(fileName);
        });
    }

    public getHeader(): string {
        return this.header;
    }
}


