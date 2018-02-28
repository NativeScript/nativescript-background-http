# Background Upload plugin for the NativeScript framework
## iOS
The iOS API is implemented in JavaScript.

## Android
The minimum supported API level is 18 and the background file upload is handled by the [android-upload-service](https://github.com/alexbbb/android-upload-service) Open-Source library.

## Examples

To run the demo open a terminal at the root of the repo and start the server included in `demo-server` with the command:
```
npm run start-server
```

Then, open a second terminal, again at the root of the repo and execute (for Android):
```
npm run start-demo-android
```
OR (for iOS)
```
npm run start-demo-ios
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

uploading multiple files while using `nativescript-background-http`. Make sure all params sent to `multipartUpload` have string values.

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
