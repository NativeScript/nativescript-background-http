# Background Download / Upload plugin for the NativeScript framework
[**How to use the plugin, see: source/README.md**](source/)

## Prerequisites

Get submodules
```
git submodule update --init
```

 - [nodejs](https://nodejs.org/)
 - [nativescript](https://www.nativescript.org/)
 - [grunt](http://gruntjs.com/getting-started)  
```
npm install -g grunt-cli
```
 - [tsd](https://github.com/DefinitelyTyped/tsd)  
```
npm install -g tsd
```
 - [appium](http://appium.io/getting-started.html)
```
npm install -g appium
```

## Build
To install dev dependencies:
```
npm install
```

To compile the TypeScript and create the npm package output in `dist`:
```
grunt
```

To compile, install in the example and run it in emulator
```
grunt ios
```
Or
```
grunt android
```

## To Run the Tests
The following command will build the plugin from source, add it to and build the example app and start the automation tests:
```
grunt tests
```
The tests use appium to interact with the app, and may start the upload server located in [www](./examples/www/server.js).

## iOS
The iOS API is implemented in JavaScript.

## Android
The minimum supported API level is 18 and the background file upload is handled by the [android-upload-service](https://github.com/alexbbb/android-upload-service) Open-Source library.
