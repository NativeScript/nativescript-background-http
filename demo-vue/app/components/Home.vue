<template>
  <Page class="page">
    <ActionBar class="action-bar">
      <Label class="action-bar-title" text="Home"></Label>
    </ActionBar>

    <GridLayout rows="3*,10, 2*, auto" columns="*, *, *">
      <ListView colspan="3" for="item in tasks">
        <v-template>
          <StackLayout>
            <Label :text="item.description"></Label>
            <Progress :value="item.upload" :maxValue="item.totalUpload"></Progress>
            <Label :text="'Uploading: ' + item.upload + ' / ' + item.totalUpload"></Label>
            <Label :text="'Status: ' + item.status"></Label>
          </StackLayout>
        </v-template>
        <!-- <ng-template let-item="item">
            <StackLayout>
                <Label [text]="item.description"></Label>
                <Progress [value]="item.upload" [maxValue]="item.totalUpload"></Progress>
                <Label [text]="'Uploading: ' + item.upload + ' / ' + item.totalUpload"></Label>
                <Label [text]="'Status: ' + item.status"></Label>
            </StackLayout>
        </ng-template>-->
      </ListView>
      <StackLayout class="hr-dark" row="1" colspan="3"></StackLayout>
      <ListView row="2" colspan="3" for="item in events">
        <v-template let-item="item">
          <StackLayout>
            <Label :text="item.eventTitle"></Label>
            <Label :text="item.eventData" textWrap="true"></Label>
          </StackLayout>
        </v-template>
      </ListView>
      <Button row="3" margin="2" text="Upload!" @tap="onUploadTap"></Button>
      <Button row="3" col="1" margin="2" text="Error-Up!" @tap="upload_error"></Button>
      <Button row="3" col="2" margin="2" text="MultiPart-Up!" @tap="onUploadMultiTap"></Button>
    </GridLayout>

    <!-- <GridLayout>
            <Label class="info" horizontalAlignment="center" verticalAlignment="center">
                <FormattedString>
                    <Span class="fa" text.decode="&#xf135; "/>
                    <Span :text="message"/>
                </FormattedString>
            </Label>
    </GridLayout>-->
  </Page>
</template>

<script>
const bgHttp = require("nativescript-background-http");

export default {
  computed: {
    message() {
      return "Blank {N}-Vue app";
    }
  },
  data() {
    return {
      tasks: [],
      events: [],
      file: "",
      url: "http://localhost:8080",
      session: bgHttp.session("image-upload")
    };
  },
  methods: {
    onUploadTap: function(e) {
      this.startUpload(false, false);
    },
    onUploadMultiTap: function() {
      this.startUpload(false, true);
    },
    startUpload: function(shouldFail, isMulti) {
      console.log(
        (should_fail ? "Testing error during upload of " : "Uploading file: ") +
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

      if (should_fail) {
        request.headers["Should-Fail"] = true;
      }

      let task; //: bgHttp.Task;
      let lastEvent = "";
      if (isMulti) {
        const params = [
          { name: "test", value: "value" },
          { name: "fileToUpload", filename: this.file, mimeType: "image/jpeg" }
        ];
        task = this.session.multipartUpload(params, request);
      } else {
        task = this.session.uploadFile(this.file, request);
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
            body: e.data
          })
        });
      }

      task.on("progress", onEvent.bind(this));
      task.on("error", onEvent.bind(this));
      task.on("responded", onEvent.bind(this));
      task.on("complete", onEvent.bind(this));
      lastEvent = "";
      this.tasks.push(task);
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
