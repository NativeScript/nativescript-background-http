# Background Upload NativeScript plugin [![Build Status](https://travis-ci.org/NativeScript/nativescript-background-http.svg?branch=master)](https://travis-ci.org/NativeScript/nativescript-background-http)

A cross platform plugin for [the NativeScript framework](http://www.nativescript.org), that provides background upload for iOS and Android.

[There is a stock NativeScript `http` module that can handle GET/POST requests that work with strings and JSONs](http://docs.nativescript.org/ApiReference/http/HOW-TO). It however comes short in features when it comes to really large files.

The plugin uses [NSURLSession with background session configuration for iOS](https://developer.apple.com/library/ios/documentation/Foundation/Reference/NSURLSessionConfiguration_class/index.html#//apple_ref/occ/clm/NSURLSessionConfiguration/backgroundSessionConfigurationWithIdentifier:); and for android - the [alexbbb/android-upload-service](https://github.com/alexbbb/android-upload-service) that implements an IntentService.

## Installation

```javascript
tns plugin add nativescript-background-http
```

## Usage

The below attached code snippets demonstrate how to use `nativescript-background-http`, while uploading single or multiple files.

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
> To get advantage of the demo apps and test the functionality, you will have to start the server from `demo-server` folder part of the repository. To do so, execute `cd demo-server && npm run start` command in a terminal.

## Contribute
We love PRs! Check out the [contributing guidelines](CONTRIBUTING.md). If you want to contribute, but you are not sure where to start - look for [issues labeled `help wanted`](https://github.com/NativeScript/nativescript-background-http/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22).

## Get Help 
Please, use [github issues](https://github.com/NativeScript/nativescript-background-http/issues) strictly for [reporting bugs](CONTRIBUTING.md#reporting-bugs) or [requesting features](CONTRIBUTING.md#requesting-new-features). For general questions and support, check out [Stack Overflow](https://stackoverflow.com/questions/tagged/nativescript) or ask our experts in [NativeScript community Slack channel](http://developer.telerik.com/wp-login.php?action=slack-invitation).

## License

Apache License Version 2.0, January 2004
![](https://ga-beacon.appspot.com/UA-111455-24/nativescript/nativescript-background-http?pixel)
