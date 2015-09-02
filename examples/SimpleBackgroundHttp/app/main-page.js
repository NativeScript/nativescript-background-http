var fs = require("file-system");
var platform = require("platform");
var bgHttp = require("background-http");
var ObservableArray = require("data/observable-array").ObservableArray;

var session = bgHttp.session("image-upload");
var tasks = new ObservableArray();

var file;
var url;

if (platform.device.os == platform.platformNames.ios) {
	file = NSURL.fileURLWithPath(__dirname + "/bigpic.jpg").toString();
	// TODO: This works for emulator. Real device will need other address.
	url = "http://localhost:8083";
} else {
	file = __dirname + "/bigpic.jpg";
	// TODO: This works for emulator. Real device will need other address.
	url = "http://10.0.2.2:8083";
}

function pageLoaded(args) {
    var page = args.object;
    page.bindingContext = tasks;
}
exports.pageLoaded = pageLoaded;

function upload(args) {
	console.log("Upload!");
	
	console.log("Upload file: " + file);
	var name = "bigpic.jpg";
	var description = name + " " + new Date().getTime().toString();

	var request = {
		url: url,
		method: "POST",
		headers: {
			"Content-Type": "application/octet-stream",
			"File-Name": name
		},
		description: description
	};

	var task = session.uploadFile(file, request);
	tasks.push(task);
}
exports.upload = upload;
