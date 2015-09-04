import application = require("application");
import frame = require("ui/frame");
import data_observable = require("data/observable");

var servicePackage = (<any>com).alexbbb.uploadservice;

var ProgressReceiver = servicePackage.AbstractUploadServiceReceiver.extend({
    onProgress: function(uploadId, currentBytes, totalBytes) {
        if (arguments.length === 3) {
            var task = Task.fromId(uploadId);
            task.setUpload(currentBytes);
            task.setTotalUpload(totalBytes);
            task.setStatus("uploading");
            task.notify({ eventName: "progress", object: task, currentBytes: currentBytes, totalBytes: totalBytes });
        }
    },

    onError: function(uploadId, error) {
        var task = Task.fromId(uploadId);
        task.setStatus("error");
        task.notify({ eventName: "error", object: task, error: error });
    },

    onCompleted: function(uploadId, responseCode, responseMessage) {
        console.log("onCompleted: " + uploadId + " " + responseCode + " " + responseMessage);
        var task = Task.fromId(uploadId);

        var totalUpload = task.totalUpload;
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
        // TODO: While there are interested parties:
        var context = application.android.context;
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

        var headers = options.headers;
        if (headers) {
            for (var header in headers) {
                var value = headers[header];
                if (value !== null && value !== void 0) {
                    request.addHeader(header, value.toString());
                    console.log("Set header: " + header + " " + headers[header]);
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



