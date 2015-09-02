import application = require("application");
import frame = require("ui/frame");
import data_observable = require("data/observable");

var servicePackage = (<any>com).alexbbb.uploadservice;

var ProgressReceiver = servicePackage.AbstractUploadServiceReceiver.extend({
    onProgress: function(uploadId, progress) {
        // TODO: We will have to either change the iOS version to give a progress percentage or have here upload / total upload pair.
        console.log("onProgress: " + uploadId + " " + progress);
        Task.fromId(uploadId).setUpload(progress);
        Task.fromId(uploadId).setTotalUpload(100);
    },

    onError: function(uploadId, error) {
        console.log("onError: " + uploadId + " " + error);
    },

    onCompleted: function(uploadId, responseCode, responseMessage) {
        console.log("onCompleted: " + uploadId + " " + responseCode + " " + responseMessage);
        // TODO: We may want to track active uploads and when there is no such to close the broadcast receiver
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
        // TODO: These should belong to a session. You should be able to retrieve them after app restart if the service continued work.
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

    static create(session: Session, file: string, options: any): Task {
        var task = new Task();
        task._session = session;
        task._id = session.id + "{" + ++Task.taskCount + "}";

        var context = application.android.context;

        // TODO: The Java send multipart, instead implement request with a single file.
        // TODO: The id should be in a "session id" + "task id".
        var request = new servicePackage.UploadRequest(context, task._id, options.url);
        request.addFileToUpload(file, "file", null, servicePackage.ContentType.APPLICATION_OCTET_STREAM);

        var headers = options.headers;
        if (headers) {
            for (var header in headers) {
                request.addHeader(header, headers[header]);
                console.log("Set header: " + header + " " + headers[header]);
            }
        }

        // TODO: It seems some fields such as "customUserAgent" in the UploadRequest are set by means other than headers. They will need extra care.

        request.setMethod(options.method ? options.method : "GET");
        // TODO: Description.

        servicePackage.UploadService.startUpload(request);

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

    get description(): string {
        // TODO: We need a way to store a description in the task...
        return "";
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
}



