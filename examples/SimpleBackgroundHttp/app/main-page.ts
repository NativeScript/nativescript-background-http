import * as bghttp from "nativescript-background-http";
import { isIOS } from "platform";
import { ObservableArray } from "data/observable-array";

var session = bghttp.session("image-upload");
// TODO: Implement retrieval of existing tasks in the session.

var context = {
	tasks: new ObservableArray<bghttp.Task>(),
	events: new ObservableArray()
}

var file = __dirname + "/bigpic.jpg";
var url;

if (isIOS) {
	// NOTE: This works for emulator. Real device will need other address.
	url = "http://localhost:8083";
} else {
	// NOTE: This works for emulator. Real device will need other address.
	url = "http://10.0.2.2:8083";
}

function pageLoaded(args) {
	var page = args.object;
	page.bindingContext = context;
}
exports.pageLoaded = pageLoaded;

function upload(args) {
	start_upload(false, false);
}
exports.upload = upload;

function upload_error(args) {
	start_upload(true, false);
}
exports.upload_error = upload_error;

function upload_multi(args) {
	start_upload(false, true);
}
exports.upload_multi = upload_multi;

var counter = 0;

function start_upload(should_fail, isMulti) {
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
		description: description,
		androidDisplayNotificationProgress: false
	};

	if (should_fail) {
		request.headers["Should-Fail"] = true;
	}

	let task: bghttp.Task;
	if (isMulti) {
		var params = [
			{ name: "test", value: "value" },
			{ name: "fileToUpload", filename: file, mimeType: 'image/jpeg' }
		];
		task = session.multipartUpload(params, request);
	} else {
		task = session.uploadFile(file, request);
	}

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

	// TODO: Log up 2-3 progress events per task or the UI is polluted: task.on("progress", onEvent);
	task.on("error", onEvent);
	task.on("complete", onEvent);

	context.tasks.push(task);
}
