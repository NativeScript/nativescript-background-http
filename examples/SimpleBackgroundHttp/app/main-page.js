var bghttp = require("nativescript-background-http");
var fs = require("file-system");
var platform = require("platform");
var ObservableArray = require("data/observable-array").ObservableArray;
var session = bghttp.session("image-upload");
var context = {
    tasks: new ObservableArray(),
    events: new ObservableArray()
};
var file = __dirname + "/bigpic.jpg";
var url;
if (platform.device.os == platform.platformNames.ios) {
    url = "http://localhost:8083";
}
else {
    url = "http://10.0.2.2:8083";
}
function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = context;
}
exports.pageLoaded = pageLoaded;
function upload(args) {
    start_upload(false);
}
exports.upload = upload;
function upload_error(args) {
    start_upload(true);
}
exports.upload_error = upload_error;
var counter = 0;
function start_upload(should_fail) {
    console.log("Upload!");
    console.log("Upload file: " + file);
    var name = "bigpic.jpg";
    var description = name + " " + ++counter;
    var request = {
        url: url,
        method: "POST",
        headers: {
            "Content-Type": "application/octet-stream",
            "File-Name": name
        },
        description: description
    };
    if (should_fail) {
        request.headers["Should-Fail"] = true;
    }
    var task = session.uploadFile(file, request);
    function onEvent(e) {
        context.events.push({
            eventTitle: e.eventName + " " + e.object.description,
            eventData: JSON.stringify({
                error: e.error ? e.error.toString() : e.error,
                currentBytes: e.currentBytes,
                totalBytes: e.totalBytes
            })
        });
    }
    task.on("error", onEvent);
    task.on("complete", onEvent);
    context.tasks.push(task);
}
