# Development Workflow

<!-- TOC depthFrom:2 -->

- [Prerequisites](#prerequisites)
- [Develop locally](#develop-locally)
- [Testing the plugin](#testing-the-plugin)
- [Native android changes](#native-android-changes)

<!-- /TOC -->

## Prerequisites

- Install your native toolchain and NativeScript as [described in the docs](https://docs.nativescript.org/start/quick-setup)

- Review [NativeScript plugins documentation](https://docs.nativescript.org/plugins/plugins) for more details on plugins development

## Develop locally

For local development we recommend using the npm commands provided in the root directory of the repository.

To run and develop using TypeScript demo:

```bash
# Navigate to the src directory:
cd src/
# Run the demo server, which is used to handle uploads from the demo app. Best to run from a separate terminal.
npm run server
# Run the demo for iOS or Android.
npm run demo.ios
npm run demo.android
```

## Testing the plugin

The demo application is configured to run on a simulator/emulator on the local machine. If you want to test on a real device, you should change the URL in the `demo/app/home-view-model.ts` to point to the machine that is running the demo server. Be careful if using an online test service, e.g. [http://httpbin.org/post](http://httpbin.org/post). Some services are configured to return the uploaded file contents in the server response, which might crash the demo app if the uploaded file is large.

## Native android changes

For android, the plugin uses [a fork](https://github.com/NativeScript/android-upload-service) of the [gotev/android-upload-service](https://github.com/gotev/android-upload-service) library for Android.
Avoid fixes and new features in the fork. Use the original repository and then update the fork with the changes.
The native library is used in the plugin as an aar file added in the plugin's platforms/android directory.
Here's how to reflect any changes in the native library in this plugin. First make sure the changes are included in the fork. Then clone the fork and run the following command in its root directory:
```
./gradlew clean assembleRelease
```
This will produce a new aar file here: android-upload-service/uploadservice/build/outputs/aar/uploadservice-release.aar. Use it to replace the previous aar in the plugin: nativescript-background-http/src/platforms/android/uploadservice-release.aar

For details on plugins development workflow, read [NativeScript plugins documentation](https://docs.nativescript.org/plugins/building-plugins#step-2-set-up-a-development-workflow) covering that topic.
