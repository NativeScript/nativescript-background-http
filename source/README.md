A cross platform plugin for [the NativeScript framework](http://www.nativescript.org).

Supports background upload for
 - iOS
 - Android

### How-to Background Upload

``` JavaScript
var background_http = require("background-http");
var session = background_http.session("image-upload");

var request = {
    url: "http://myserver.com",
    method: "POST",
    headers: {
        "Content-Type": "application/octet-stream",
        "File-Name": "bigpig.jpg"
    },
    description: "{ 'uploading': 'bigpig.jpg' }"
};

var task = session.uploadFile("file/path/bigpig.jpg", request);

task.on("progress", logEvent);
task.on("error", logEvent);
task.on("complete", logEvent);

function onEvent(e) {
	console.log(e.eventName);
}
```
