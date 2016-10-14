import application = require("application");
import frame = require("ui/frame");
import data_observable = require("data/observable");
import utils = require("utils/utils");

declare var net;

var servicePackage = (<any>net).gotev.uploadservice;

interface UploadInfo {
    getUploadId(): string;
    getTotalBytes(): number;
    getUploadedBytes(): number;
}
interface ServerResponse {
    
}

var ProgressReceiver = servicePackage.UploadServiceBroadcastReceiver.extend({
    onProgress(uploadInfo: UploadInfo) {
        console.log("onProgress");
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
        console.log("onCancelled");
        this.onError(uploadInfo, new Error("Cancelled"));
    },

    onError(uploadInfo: UploadInfo, error) {
        console.log("onError");
        var uploadId = uploadInfo.getUploadId();
        var task = Task.fromId(uploadId);
        task.setStatus("error");
        task.notify({ eventName: "error", object: task, error: error });
    },

    onCompleted(uploadInfo: UploadInfo, servicerResponse: ServerResponse) {
        console.log("onCompleted");
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
        task.notify({ eventName: "complete", object: task });
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

    public uploadFile(file: string, options: any): Task {
        return Task.create(this, file, options);
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

    static create(session: Session, file: string, options: any): Task {
        var task = new Task();
        task._session = session;
        task._id = session.id + "{" + ++Task.taskCount + "}";

        var context = application.android.context;

        var request = new servicePackage.BinaryUploadRequest(context, task._id, options.url);

        request.setFileToUpload(file);

        request.setNotificationConfig(new servicePackage.UploadNotificationConfig());

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



