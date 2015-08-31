# Background Download / Upload plugin for the NativeScript framework
[How to use the plugin, see: source/README.md](source/)

## Prerequisites
 - [nodejs](https://nodejs.org/)
 - [nativescript](https://www.nativescript.org/)
 - [grunt](http://gruntjs.com/getting-started)

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

## iOS
The iOS API is implemented in JavaScript.

## Android
The minimum supported API level is 18 and the background file upload is handled by the [android-upload-service](https://github.com/alexbbb/android-upload-service) Open-Source library.