
import application = require("application");
import frame = require("ui/frame");
import data_observable = require("data/observable");
import utils = require("utils/utils");
import * as fileSystemModule from "file-system";
import * as common from "./index";


declare var net: any;

interface UploadInfo {
    getUploadId(): string;
    getTotalBytes(): number;
    getUploadedBytes(): number;
}
interface ServerResponse {
    getBodyAsString(): string;
}

var ProgressReceiver = (<any>net).gotev.uploadservice.UploadServiceBroadcastReceiver.extend({
    onProgress(uploadInfo: UploadInfo) {
        //console.log("onProgress");
        var uploadId = uploadInfo.getUploadId();
        var task = Task.fromId(uploadId);
        var totalBytes = uploadInfo.getTotalBytes();
        var currentBytes = uploadInfo.getUploadedBytes();
        task.setTotalUpload(totalBytes);
        task.setUpload(currentBytes);
        task.setStatus("uploading");
        task.notify({ eventName: "progress", object: task, currentBytes: currentBytes, totalBytes: totalBytes });
    },

    onCancelled(uploadInfo: UploadInfo) {
        //console.log("onCancelled");
        this.onError(uploadInfo, new Error("Cancelled"));
    },

    onError(uploadInfo: UploadInfo, error) {
        //console.log("onError");
        var uploadId = uploadInfo.getUploadId();
        var task = Task.fromId(uploadId);
        task.setStatus("error");
        task.notify({ eventName: "error", object: task, error: error });
    },

    onCompleted(uploadInfo: UploadInfo, serverResponse: ServerResponse) {
        //console.log("onCompleted");
        var uploadId = uploadInfo.getUploadId();
        var task = Task.fromId(uploadId);

        var totalUpload = uploadInfo.getTotalBytes();
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

var receiver;

export function session(id: string) {

    if (!receiver) {
        var context = utils.ad.getApplicationContext();
        receiver = new ProgressReceiver();
        receiver.register(context);
    }

    // TODO: Cache.
    return new Session(id);
}

class ObservableBase extends data_observable.Observable {
    protected notifyPropertyChanged(propertyName: string, value: any): void {
        this.notify({ object: this, eventName: data_observable.Observable.propertyChangeEvent, propertyName: propertyName, value: value });
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
        var task = new Task();
        task._session = session;
        task._id = session.id + "{" + ++Task.taskCount + "}";

        var context = application.android.context;

        var request = new (<any>net).gotev.uploadservice.BinaryUploadRequest(context, task._id, options.url);

        request.setFileToUpload(file);

        var displayNotificationProgress = typeof options.androidDisplayNotificationProgress === "boolean" ? options.androidDisplayNotificationProgress : true;
        if (displayNotificationProgress) {
            request.setNotificationConfig(new (<any>net).gotev.uploadservice.UploadNotificationConfig());
        }

        var headers = options.headers;
        if (headers) {
            for (var header in headers) {
                var value = headers[header];
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
        var task = new Task();
        task._session = session;
        task._id = session.id + "{" + (++Task.taskCount) + "}";

        var context = application.android.context;

        var request = new net.gotev.uploadservice.MultipartUploadRequest(context, task._id, options.url);

        for (var i=0;i<params.length;i++) {
            var curParam = params[i];
            if (typeof curParam.name === 'undefined') {
                throw new Error("You must have a `name` value");
            }

            if (curParam.filename) {
                var fileName = curParam.filename;
                if (fileName.startsWith("~/")) {
                    fileName = fileName.replace("~/", fileSystemModule.knownFolders.currentApp().path + "/");
                }
                var destFileName = curParam.destFilename || fileName.substring(fileName.lastIndexOf('/')+1, fileName.length);

                request.addFileToUpload(fileName, curParam.name, destFileName, curParam.mimeType);
            } else {
                request.addParameter(params[i].name, params[i].value);

            }
        }

        var utf8 = options.utf8;

        if (utf8) {
            request.setUtf8Charset();
        }

        var displayNotificationProgress = typeof options.androidDisplayNotificationProgress === "boolean" ? options.androidDisplayNotificationProgress : true;
        if (displayNotificationProgress) {
          request.setNotificationConfig(new (<any>net).gotev.uploadservice.UploadNotificationConfig());
        }

        var headers = options.headers;
        if (headers) {
            for (var header in headers) {
                var value = headers[header];
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
}



