# Background Upload plugin for the NativeScript framework
[**How to use the plugin, see: source/README.md**](source/)

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
