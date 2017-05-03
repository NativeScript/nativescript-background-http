# Background Upload plugin for the NativeScript framework
[**How to use the plugin, see: source/README.md**](nativescript-background-http/)

## iOS
The iOS API is implemented in JavaScript.

## Android
The minimum supported API level is 18 and the background file upload is handled by the [android-upload-service](https://github.com/alexbbb/android-upload-service) Open-Source library.

## Examples
To run the example open a terminal and run in the root of the repo:
```
npm install
```

This will start the server included in `examples/www`:
```
npm start
```

Open a second terminal, again at the root of the repo.
This will create a link from the nativescript-background-http to the examples/SimpleBackgroundHttp's node_modules so you can build and run the plugin from source:
```
npm run link
```

To compile the TypeScript of the plugin:
```
npm run tsc
```

Then to run the app:
```
tns run android --path examples/SimpleBackgroundHttp
```

## Usage

The below attached code snippets demostrate how to use `nativescript-background-http`, while uploading single or multiple files.

For further help review the (SimpleBackgroundHttp)[https://github.com/NativeScript/nativescript-background-http/tree/master/examples] application.

### uploadFile

uploading sigle file to the service

```
import * as bghttp from "nativescript-background-http";
var session = bghttp.session("image-upload");

.....
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

let task: bghttp.Task;
task = session.uploadFile(file, request);
```

### multipartUpload

uploading multiple files while using `nativescript-background-http`

```
import * as bghttp from "nativescript-background-http";
var session = bghttp.session("image-upload");

.....
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

let task: bghttp.Task;
var params = [
			{ name: "test", value: "value" },
			{ name: "fileToUpload", filename: file, mimeType: 'image/jpeg' }
		];
task = session.multipartUpload(params, request);
```