A cross platform plugin for [the NativeScript framework](http://www.nativescript.org), that provides background upload for iOS and Android.

### Source
 - [GitHub](http://github.com/NativeScript/nativescript-background-http)
 - [Web Site](http://nativescript.github.io/nativescript-background-http/)
 - [API Reference](http://nativescript.github.io/nativescript-background-http/globals.html)

### License
[Apache-2.0](https://github.com/NativeScript/nativescript-background-http/blob/master/LICENSE)

### How-To Background Upload

```js
var bghttp = require("nativescript-background-http");

var session = bghttp.session("image-upload");

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

function logEvent(e) {
	console.log(e.eventName);
}
```

### How-To Data Binding
Task implementations are Observable and fire property change events for 
 - upload
 - totalUpload
 - status

So you can bind to task properties in the UI markup:
```xml
<ListView items="{{ tasks }}">
	<ListView.itemTemplate>
		<StackLayout>
			<Label text="{{ upload, 'Upload: ' + upload + ' / ' + totalUpload }}" />
			<Progress value="{{ upload }}" maxValue="{{ totalUpload }}" />
			<Label text="{{ description, 'description: ' + description }}" />
			<Label text="{{ status, 'status: ' + status }}" />
		</StackLayout>
	</ListView.itemTemplate>
</ListView>
```

### Node.js Server
A simple server written in nodejs should look like that:
```
var http = require("http");
var fs = require("fs");

var server = http.createServer(function(request, response) {
    request.pipe(fs.createWriteStream(out, { flags: 'w', encoding: null, fd: null, mode: 0666 }));
}
server.listen(8083);
```
[You can check the example server in the source](https://github.com/NativeScript/nativescript-background-http/blob/master/examples/www/server.js).
