<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <Label class="action-bar-title" text="Home"></Label>
    </ActionBar>

    <GridLayout rows="3*,10, 2*, auto" columns="*, *, *">
      <ListView colSpan="3" for="item in tasks">
        <v-template>
          <StackLayout>
            <Label :text="item.description"></Label>
            <Progress :value="item.upload" :maxValue="item.totalUpload"></Progress>
            <Label :text="'Uploading: ' + item.upload + ' / ' + item.totalUpload"></Label>
            <Label :text="'Status: ' + item.status"></Label>
          </StackLayout>
        </v-template>
      </ListView>
      <StackLayout class="hr-dark" row="1" colSpan="3"></StackLayout>
      <ListView row="2" colSpan="3" for="item in events">
        <v-template let-item="item">
          <StackLayout>
            <Label :text="item.eventTitle"></Label>
            <Label :text="item.eventData" textWrap="true"></Label>
          </StackLayout>
        </v-template>
      </ListView>
      <Button row="3" margin="2" text="Upload!" @tap="onUploadTap"></Button>
      <Button row="3" col="1" margin="2" text="Error-Up!" @tap="onUploadWithErrorTap"></Button>
      <Button row="3" col="2" margin="2" text="MultiPart-Up!" @tap="onUploadMultiTap"></Button>
    </GridLayout>
  </Page>
</template>

<script>
const bgHttp = require("nativescript-background-http");
const fs = require("file-system");
const platform = require("platform");

export default {
  data() {
    return {
      tasks: [],
      events: [],
      file: fs.path.normalize(
        fs.knownFolders.currentApp().path + "/bigpic.jpg"
      ),
      // NOTE: This works for emulator. Real device will need other address.
      url: platform.isIOS ? "http://localhost:8080" : "http://10.0.2.2:8080",
      session: bgHttp.session("image-upload"),
      counter: 0
    };
  },
  methods: {
    onUploadWithErrorTap: function(e) {
      this.session = bgHttp.session("image-upload");

      this.startUpload(true, false);
    },
    onUploadTap: function(e) {
      this.startUpload(false, false);
    },
    onUploadMultiTap: function() {
      this.startUpload(false, true);
    },
    startUpload: function(shouldFail, isMulti) {
      console.log(
        (shouldFail ? "Testing error during upload of " : "Uploading file: ") +
          this.file +
          (isMulti ? " using multipart." : "")
      );

      const name = this.file.substr(this.file.lastIndexOf("/") + 1);
      const description = `${name} (${++this.counter})`;
      const request = {
        url: this.url,
        method: "POST",
        headers: {
          "Content-Type": "application/octet-stream",
          "File-Name": name
        },
        description: description,
        androidAutoDeleteAfterUpload: false,
        androidNotificationTitle: "NativeScript HTTP background"
      };

      if (shouldFail) {
        request.headers["Should-Fail"] = true;
      }

      let taskPromise; // Promise<Task>
      let lastEvent = "";

      if (isMulti) {
        const params = [
          { name: "test", value: "value" },
          { name: "testInt", value: 10 },
          { name: "bool", value: true },
          { name: "fileToUpload", filename: this.file, mimeType: 'image/jpeg' }
        ];
        taskPromise = this.session.multipartUpload(params, request);
      } else {
        taskPromise = this.session.uploadFile(this.file, request);
      }

      function onEvent(e) {
        if (lastEvent !== e.eventName) {
          // suppress all repeating progress events and only show the first one
          lastEvent = e.eventName;
        } else {
          return;
        }

        this.events.push({
          eventTitle: e.eventName + " " + e.object.description,
          eventData: JSON.stringify({
            error: e.error ? e.error.toString() : e.error,
            currentBytes: e.currentBytes,
            totalBytes: e.totalBytes,
            body: e.data,
            responseCode: e.responseCode
          })
        });

        this.$set(this.tasks, this.tasks.indexOf(task), task);
      }

      taskPromise.then( (task) => {
        task.on("progress", onEvent.bind(this));
        task.on("error", onEvent.bind(this));
        task.on("responded", onEvent.bind(this));
        task.on("complete", onEvent.bind(this));
        lastEvent = "";
        this.tasks.push(task);
      });

    },
    onItemLoading(args) {
      let label = args.view.getViewById("imageLabel");
      label.text = "image " + args.index;
    }
  }
};
</script>

<style scoped lang="scss">
// Start custom common variables
@import "../app-variables";
// End custom common variables

// Custom styles
.fa {
  color: $accent-dark;
}

.info {
  font-size: 20;
}
</style>
