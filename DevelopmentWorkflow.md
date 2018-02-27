# Development Workflow

<!-- TOC depthFrom:2 -->

- [Prerequisites](#prerequisites)
- [Develop locally](#develop-locally)
- [Testing the plugin](#testing-the-plugin)

<!-- /TOC -->

## Prerequisites

- Install your native toolchain and NativeScript as [described in the docs](https://docs.nativescript.org/start/quick-setup)

- Review [NativeScript plugins documentation](https://docs.nativescript.org/plugins/plugins) for more details on plugins development

## Develop locally

For local development we recommend using the npm commands provided in the root directory of the repository.

To run and develop using TypeScript demo:

```bash
# Build the plugin. This compiles all TypeScript files in the plugin directory, which is referenced in the demo's package.json
npm run tsc
# Run the demo server, which is used to handle uploads from the demo app. Best to run from a separate terminal.
npm run start-server
# Run the demo for iOS or Android.
npm run start-demo-ios
npm run start-demo-android
```

## Testing the plugin

The demo application is configured to run on a simulator/emulator on the local machine. If you want to test on a real device, you should change the URL in the `demo/app/home-view-model.ts` to point to the machine that is running the demo server. Be careful if using an online test service, e.g. [http://httpbin.org/post](http://httpbin.org/post). Some services are configured to return the uploaded file contents in the server response, which might crash the demo app if the uploaded file is large.

For details on plugins development workflow, read [NativeScript plugins documentation](https://docs.nativescript.org/plugins/building-plugins#step-2-set-up-a-development-workflow) covering that topic.