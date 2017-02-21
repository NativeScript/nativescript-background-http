import { Component, NgZone, ViewChild, ElementRef } from "@angular/core";
import {session, Session, Task} from "nativescript-background-http";
import {knownFolders } from "file-system";
import {Page} from "ui/page";
import {Image} from "ui/image";
import {Progress} from "ui/progress";
import {fromFile, ImageSource} from "image-source"

class tmpTask{
    upload: number;

    totalUpload: number;
}

@Component({
    selector: "ns-app",
    templateUrl: "app.component.html",
})
export class AppComponent { 
    public newsession:Session;
    public fileURL:string="";
    public request:any;
    public imageName:string="logo";
    private documents;
    public task:Task;
    public imageSrc ="~/logo.png";

    @ViewChild("myImage") myImageRef: ElementRef;

    constructor(private page:Page, private zone:NgZone){
         this.documents = knownFolders.currentApp();
         this.fileURL = this.documents.path+"/logo.png";
         this.newsession = session("image-upload");
         this.request = {
            url: "http://httpbin.org/post",
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "File-Name": this.imageName
            },
            description: "{ 'uploading': " + this.imageName + " }"
        };
    }
    multiUpload(){
        var progress:Progress =<Progress> this.page.getViewById("prgressmultiid");
            progress.value = 0;
        var params = [{name: "test", value: "value"}, {name:"fileToUpload", filename: this.fileURL, mimeType: 'image/png'}];
       this.task = this.newsession.multipartUpload(params, this.request);
       this.task.on("progress", (e)=>{
            var progress:Progress =<Progress> this.page.getViewById("prgressmultiid");
            progress.value = e.currentBytes;
            progress.maxValue = e.totalBytes;
       });
       this.task.on("error", this.logEvent);
       this.task.on("complete", this.logEvent);
    }
    imageUplaod(){
        var progress:Progress =<Progress> this.page.getViewById("prgressid");
            progress.value = 0;
       this.task = this.newsession.uploadFile(this.fileURL, this.request);
       this.task.on("progress", (e)=>{
            var progress:Progress =<Progress> this.page.getViewById("prgressid");
            progress.value = e.currentBytes;
            progress.maxValue = e.totalBytes;
       });
       this.task.on("error", this.logEvent);
       this.task.on("complete", this.logEvent);
       
    }
    logEvent(e) {
        switch (e.eventName) {
            case "complete":
                alert("Upload complete");
                break;
            case "error":
                alert("Upload error"+e)
                break;
        
            default:
                break;
        }

        
       
        
    }
}
