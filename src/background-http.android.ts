import application = require("application");
import { Observable } from "data/observable";
import { ad } from "utils/utils";
import * as fileSystemModule from "file-system";
import { isAndroid, device } from 'platform';
import * as common from "./index";

declare const net: any;
declare const android: any;
net.gotev.uploadservice.UploadService.NAMESPACE = application.android.packageName;

interface UploadInfo {
    getUploadId(): string;
    getTotalBytes(): number;
    getUploadedBytes(): number;
}

interface ServerResponse {
    getBodyAsString(): string;
}

/* A snapshot-friendly, lazy-loaded class for ProgressReceiver BEGIN */
let ProgressReceiver: any;

function initializeProgressReceiver() {
    if (ProgressReceiver) {
        return;
    }

    const ProgressReceiverImpl = net.gotev.uploadservice.UploadServiceBroadcastReceiver.extend({
        onProgress(context: any, uploadInfo: UploadInfo) {
            const uploadId = uploadInfo.getUploadId();
            const task = Task.fromId(uploadId);
            const totalBytes = uploadInfo.getTotalBytes();
            const currentBytes = uploadInfo.getUploadedBytes();
            task.setTotalUpload(totalBytes);
            task.setUpload(currentBytes);
            task.setStatus("uploading");
            task.notify({ eventName: "progress", object: task, currentBytes: currentBytes, totalBytes: totalBytes });
        },

        onCancelled(context: any, uploadInfo: UploadInfo) {
            const uploadId = uploadInfo.getUploadId();
            const task = Task.fromId(uploadId);
            task.setStatus("cancelled");
            task.notify({ eventName: "cancelled", object: task });
        },

        onError(context: any, uploadInfo: UploadInfo, error) {
            const uploadId = uploadInfo.getUploadId();
            const task = Task.fromId(uploadId);
            task.setStatus("error");
            task.notify({ eventName: "error", object: task, error: error });
        },

        onCompleted(context: any, uploadInfo: UploadInfo, serverResponse: ServerResponse) {
            const uploadId = uploadInfo.getUploadId();
            const task = Task.fromId(uploadId);

            let totalUpload = uploadInfo.getTotalBytes();
            if (!totalUpload || !isFinite(totalUpload) || totalUpload <= 0) {
                totalUpload = 1;
            }
            task.setUpload(totalUpload);
            task.setTotalUpload(totalUpload);
            task.setStatus("complete");

            task.notify({ eventName: "progress", object: task, currentBytes: totalUpload, totalBytes: totalUpload });
            task.notify({ eventName: "responded", object: task, data: serverResponse.getBodyAsString() });
            task.notify({ eventName: "complete", object: task, response: serverResponse });
        }
    });

    ProgressReceiver = ProgressReceiverImpl as any;
}
/* ProgressReceiver END */

let receiver: any;

export function session(id: string) {

    if (!receiver) {
        const context = ad.getApplicationContext();
        initializeProgressReceiver();
        receiver = new ProgressReceiver();
        receiver.register(context);
    }

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
        const task = new Task();
        task._session = session;
        task._id = session.id + "{" + ++Task.taskCount + "}";

        const context = application.android.context;

        const request = new net.gotev.uploadservice.BinaryUploadRequest(context, task._id, options.url);

        request.setFileToUpload(file);

        const displayNotificationProgress = typeof options.androidDisplayNotificationProgress === "boolean" ? options.androidDisplayNotificationProgress : true;

        if (isAndroid && parseInt(device.sdkVersion) >= 26) {
            const channel = new android.app.NotificationChannel(application.android.packageName, application.android.packageName, android.app.NotificationManager.IMPORTANCE_LOW);
            const notificationManager = context.getSystemService(android.content.Context.NOTIFICATION_SERVICE)
            notificationManager.createNotificationChannel(channel);
        }

        if (displayNotificationProgress) {
            const uploadNotificationConfig = new net.gotev.uploadservice.UploadNotificationConfig();
            uploadNotificationConfig.setNotificationChannelId(application.android.packageName);
            request.setNotificationConfig(uploadNotificationConfig);
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
