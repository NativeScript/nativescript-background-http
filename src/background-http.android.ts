import * as application from "application";
import { Observable } from "data/observable";
import * as fileSystemModule from "file-system";
import * as common from "./index";

type Context = android.content.Context;
type ServerResponse = net.gotev.uploadservice.ServerResponse;
type UploadInfo = net.gotev.uploadservice.UploadInfo;
type UploadServiceBroadcastReceiver = net.gotev.uploadservice.UploadServiceBroadcastReceiver;

/* A snapshot-friendly, lazy-loaded class for ProgressReceiver BEGIN */
let ProgressReceiver: any;

function onProgressReceiverProgress(context: Context, uploadInfo: UploadInfo) {
    const uploadId = uploadInfo.getUploadId();
    const task = Task.fromId(uploadId);
    const totalBytes = uploadInfo.getTotalBytes();
    const currentBytes = uploadInfo.getUploadedBytes();
    task.setTotalUpload(totalBytes);
    task.setUpload(currentBytes);
    task.setStatus("uploading");
    task.notify(<common.ProgressEventData>{
      eventName: "progress",
      object: task,
      currentBytes: currentBytes,
      totalBytes: totalBytes
    });
}

function onProgressReceiverCancelled(context: Context, uploadInfo: UploadInfo) {
    const uploadId = uploadInfo.getUploadId();
    const task = Task.fromId(uploadId);
    task.setStatus("cancelled");
    task.notify({ eventName: "cancelled", object: task });
}

function onProgressReceiverError(context: Context, uploadInfo: UploadInfo, response: ServerResponse, error: java.lang.Exception) {
    const uploadId = uploadInfo.getUploadId();
    const task = Task.fromId(uploadId);
    task.setStatus("error");
    task.notify(<common.ErrorEventData>{
      eventName: "error",
      object: task,
      error,
      responseCode: response && typeof response.getHttpCode === 'function' ? response.getHttpCode() : -1,
      response
    });
}

function onProgressReceiverCompleted(context: Context, uploadInfo: UploadInfo, response: ServerResponse) {
    const uploadId = uploadInfo.getUploadId();
    const task = Task.fromId(uploadId);

    let totalUpload = uploadInfo.getTotalBytes();
    if (!totalUpload || !isFinite(totalUpload) || totalUpload <= 0) {
        totalUpload = 1;
    }
    task.setUpload(totalUpload);
    task.setTotalUpload(totalUpload);
    task.setStatus("complete");

    task.notify(<common.ProgressEventData>{
      eventName: "progress",
      object: task,
      currentBytes: totalUpload,
      totalBytes: totalUpload
    });
    task.notify(<common.ResultEventData>{
      eventName: "responded",
      object: task,
      data: response.getBodyAsString(),
      responseCode: response && typeof response.getHttpCode === 'function' ? response.getHttpCode() : -1
    });
    task.notify(<common.CompleteEventData>{
      eventName: "complete",
      object: task,
      responseCode: response && typeof response.getHttpCode === 'function' ? response.getHttpCode() : -1
    });
}

function initializeProgressReceiver() {
    if (ProgressReceiver) {
        return;
    }

    const zonedOnProgress = global.zonedCallback(onProgressReceiverProgress);
    const zonedOnCancelled = global.zonedCallback(onProgressReceiverCancelled);
    const zonedOnError = global.zonedCallback(onProgressReceiverError);
    const zonedOnCompleted = global.zonedCallback(onProgressReceiverCompleted);

    const temp: Partial<UploadServiceBroadcastReceiver> = {
      onProgress(context: Context, uploadInfo: UploadInfo) {
        zonedOnProgress(context, uploadInfo);
      },

      onCancelled(context: Context, uploadInfo: UploadInfo) {
        zonedOnCancelled(context, uploadInfo);
      },

      onError(context: Context, uploadInfo: UploadInfo, response: ServerResponse, error: java.lang.Exception) {
        zonedOnError(context, uploadInfo, response, error);
      },

      onCompleted(context: Context, uploadInfo: UploadInfo, serverResponse: ServerResponse) {
        zonedOnCompleted(context, uploadInfo, serverResponse);
      }
    };

    const ProgressReceiverImpl = (<any>net.gotev.uploadservice.UploadServiceBroadcastReceiver).extend(temp);

    ProgressReceiver = ProgressReceiverImpl as any;
}
/* ProgressReceiver END */

let hasNamespace = false;
function ensureUploadServiceNamespace() {
    if (!hasNamespace) {
        net.gotev.uploadservice.UploadService.NAMESPACE = application.android.packageName;
        hasNamespace = true;
    }
}

let receiver: any;
function ensureReceiver() {
    if (!receiver) {
        const context = application.android.context;
        initializeProgressReceiver();
        receiver = new ProgressReceiver();
        receiver.register(context);
    }
}

export function session(id: string) {
    // TODO: Cache.
    return new Session(id);
}

class ObservableBase extends Observable {
    protected notifyPropertyChanged(propertyName: string, value: any): void {
        this.notify({ object: this, eventName: Observable.propertyChangeEvent, propertyName: propertyName, value: value });
    }
}

class Session {
    private _id: string;

    constructor(id: string) {
        this._id = id;
    }

    public uploadFile(fileUri: string, options: common.Request): Task {
        return Task.create(this, fileUri, options);
    }

    public multipartUpload(params: Array<any>, options: common.Request): Task {
        return Task.createMultiPart(this, params, options);
    }

    get id(): string {
        return this._id;
    }
}

class Task extends ObservableBase {
    private static taskCount = 0;
    private static cache = {};

    private _session;
    private _id;

    private _upload: number;
    private _totalUpload: number;
    private _status: string;
    private _description: string;

    static create(session: Session, file: string, options: common.Request): Task {
        ensureUploadServiceNamespace();
        ensureReceiver();
        const task = new Task();
        task._session = session;
        task._id = session.id + "{" + ++Task.taskCount + "}";

        const context = application.android.context;

        const request = new net.gotev.uploadservice.BinaryUploadRequest(context, task._id, options.url);

        request.setFileToUpload(file);

        const displayNotificationProgress = typeof options.androidDisplayNotificationProgress === "boolean" ? options.androidDisplayNotificationProgress : true;
        if (displayNotificationProgress) {
            request.setNotificationConfig(new net.gotev.uploadservice.UploadNotificationConfig());
        }
        const autoDeleteAfterUpload = typeof options.androidAutoDeleteAfterUpload === "boolean" ? options.androidAutoDeleteAfterUpload : false;
        if (autoDeleteAfterUpload) {
            request.setAutoDeleteFilesAfterSuccessfulUpload(true);
        }

        const headers = options.headers;
        if (headers) {
            for (const header in headers) {
                const value = headers[header];
                if (value !== null && value !== void 0) {
                    request.addHeader(header, value.toString());
                }
            }
        }

        task.setDescription(options.description);

        request.setMethod(options.method ? options.method : "GET");

        task.setUpload(0);
        task.setTotalUpload(1);
        task.setStatus("pending");

        request.startUpload();

        Task.cache[task._id] = task;

        return task;
    }

    static createMultiPart(session: Session, params: Array<any>, options: common.Request): Task {
        ensureUploadServiceNamespace();
        ensureReceiver();
        const task = new Task();
        task._session = session;
        task._id = session.id + "{" + (++Task.taskCount) + "}";

        const context = application.android.context;

        const request = new net.gotev.uploadservice.MultipartUploadRequest(context, task._id, options.url);


        for (let i = 0; i < params.length; i++) {
            const curParam = params[i];
            if (typeof curParam.name === 'undefined') {
                throw new Error("You must have a `name` value");
            }

            if (curParam.filename) {
                let fileName = curParam.filename;
                if (fileName.startsWith("~/")) {
                    fileName = fileName.replace("~/", fileSystemModule.knownFolders.currentApp().path + "/");
                }

                const destFileName = curParam.destFilename || fileName.substring(fileName.lastIndexOf('/') + 1, fileName.length);
                request.addFileToUpload(fileName, curParam.name, destFileName, curParam.mimeType);
            } else {
                request.addParameter(params[i].name, params[i].value);

            }
        }

        const utf8 = options.utf8;

        if (utf8) {
            request.setUtf8Charset();
        }

        const displayNotificationProgress = typeof options.androidDisplayNotificationProgress === "boolean" ? options.androidDisplayNotificationProgress : true;
        if (displayNotificationProgress) {
            request.setNotificationConfig(new net.gotev.uploadservice.UploadNotificationConfig());
        }

        const headers = options.headers;
        if (headers) {
            for (const header in headers) {
                const value = headers[header];
                if (value !== null && value !== void 0) {
                    request.addHeader(header, value.toString());
                }
            }
        }

        task.setDescription(options.description);

        request.setMethod(options.method ? options.method : "GET");

        task.setUpload(0);
        task.setTotalUpload(1);
        task.setStatus("pending");

        request.startUpload();

        Task.cache[task._id] = task;

        return task;
    }

    static fromId(id: string): Task {
        return Task.cache[id];
    }

    get upload(): number {
        return this._upload;
    }

    get totalUpload(): number {
        return this._totalUpload;
    }

    get status(): string {
        return this._status;
    }

    get description(): string {
        return this._description;
    }

    get session(): Session {
        return this._session;
    }

    setTotalUpload(value: number) {
        this._totalUpload = value;
        this.notifyPropertyChanged("totalUpload", value);
    }

    setUpload(value: number) {
        this._upload = value;
        this.notifyPropertyChanged("upload", value);
    }

    setStatus(value: string) {
        this._status = value;
        this.notifyPropertyChanged("status", value);
    }

    setDescription(value: string) {
        this._description = value;
        this.notifyPropertyChanged("description", value);
    }
    cancel(): void {
        (<any>net).gotev.uploadservice.UploadService.stopUpload(this._id);
    }
}
