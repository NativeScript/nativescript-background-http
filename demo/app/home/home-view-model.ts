import * as bghttp from "nativescript-background-http";
import { isIOS } from "platform";
import { Observable } from 'data/observable';
import { ObservableArray } from "data/observable-array";
import * as app from "application";

export class HomeViewModel extends Observable {
    tasks: ObservableArray<bghttp.Task>;
    events: ObservableArray<{ eventTitle: string, eventData: any }>;
    file: string;
    url: string;
    counter: number;
    session: any;

    constructor() {
        super();

        this.tasks = new ObservableArray<bghttp.Task>();
        this.events = new ObservableArray();
        this.counter = 0;
        this.file = __dirname + "/bigpic.jpg";
        if (isIOS) {
            // NOTE: This works for emulator. Real device will need other address.
            this.url = "http://localhost:8080";
        } else {
            // NOTE: This works for emulator. Real device will need other address.
            this.url = "http://10.0.2.2:8080";
        }
        this.session = bghttp.session("image-upload");
    }

    upload(args) {
        this.start_upload(false, false);
    }

    upload_error(args) {
        this.start_upload(true, false);
    }

    upload_multi(args) {
        this.start_upload(false, true);
    }

    start_upload(should_fail, isMulti) {
        console.log((should_fail ? "Testing error during upload of " : "Uploading file: ") + this.file + (isMulti ? " using multipart." : ""));

        const name = this.file.substr(this.file.lastIndexOf("/") + 1);
        const description = `${name} (${++this.counter})`;
        const request = {
            url: this.url,
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "File-Name": name
            },
            description: description,
            androidAutoDeleteAfterUpload: false
        };

        if (should_fail) {
            request.headers["Should-Fail"] = true;
        }

        let task: bghttp.Task;
        let lastEvent = "";
        if (isMulti) {
            var params = [
                { name: "test", value: "value" },
                { name: "fileToUpload", filename: this.file, mimeType: 'image/jpeg' }
            ];
            task = this.session.multipartUpload(params, request);
        } else {
            task = this.session.uploadFile(this.file, request);
        }

        function onEvent(e) {
            if (lastEvent !== e.eventName) {
                // suppress all repeating progress events and only show the first one
                lastEvent = e.eventName;
            } else {
                return;
            }

            this.events.push({
                eventTitle: e.eventName + " " + e.object.description,
                eventData: JSON.stringify({
                    error: e.error ? e.error.toString() : e.error,
                    currentBytes: e.currentBytes,
                    totalBytes: e.totalBytes,
                    body: e.data
                })
            });
        }

        task.on("progress", onEvent.bind(this));
        task.on("error", onEvent.bind(this));
        task.on("responded", onEvent.bind(this));
        task.on("complete", onEvent.bind(this));
        lastEvent = "";
        this.tasks.push(task);
    }
}
