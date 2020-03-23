import * as bgHttp from "nativescript-background-http";
import { Component } from "@angular/core";
import { isIOS } from "platform";
import { ObservableArray } from "data/observable-array";
import * as fs from "file-system";

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent {
    public tasks: bgHttp.Task[] = [];
    public events: { eventTitle: string, eventData: any }[] = [];
    private file: string;
    private url: string;
    private counter: number = 0;
    private session: any;

    constructor() {
        this.file = fs.path.normalize(fs.knownFolders.currentApp().path + "/home/bigpic.jpg");
        if (isIOS) {
            // NOTE: This works for emulator. Real device will need other address.
            this.url = "http://localhost:8080";
        } else {
            // NOTE: This works for emulator. Real device will need other address.
            this.url = "http://10.0.2.2:8080";
        }

        this.session = bgHttp.session("image-upload");
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
            androidAutoDeleteAfterUpload: false,
            androidNotificationTitle: 'NativeScript HTTP background',
        };

        if (should_fail) {
            request.headers["Should-Fail"] = true;
        }

        let taskPromise: Promise<bgHttp.Task>;
        let lastEvent = "";
        if (isMulti) {
            const params = [
                { name: "test", value: "value" },
                { name: "testInt", value: 10 },
                { name: "bool", value: true },
                { name: "fileToUpload", filename: this.file, mimeType: 'image/jpeg' }
            ];
            taskPromise = this.session.multipartUpload(params, request);
        } else {
            taskPromise = this.session.uploadFile(this.file, request);
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
                    body: e.data,
                    responseCode: e.responseCode
                })
            });
        }

        taskPromise.then( (task: bgHttp.Task) =>
        {
            task.on("progress", onEvent.bind(this));
            task.on("error", onEvent.bind(this));
            task.on("responded", onEvent.bind(this));
            task.on("complete", onEvent.bind(this));
            lastEvent = "";
            this.tasks.push(task);
        });
    }
}
