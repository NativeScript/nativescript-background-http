"use strict";
var core_1 = require("@angular/core");
var nativescript_background_http_1 = require("nativescript-background-http");
var file_system_1 = require("file-system");
var page_1 = require("ui/page");
var tmpTask = (function () {
    function tmpTask() {
    }
    return tmpTask;
}());
var AppComponent = (function () {
    function AppComponent(page, zone) {
        this.page = page;
        this.zone = zone;
        this.fileURL = "";
        this.imageName = "logo";
        this.imageSrc = "~/logo.png";
        this.documents = file_system_1.knownFolders.currentApp();
        this.fileURL = this.documents.path + "/logo.png";
        this.newsession = nativescript_background_http_1.session("image-upload");
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
    AppComponent.prototype.multiUpload = function () {
        var _this = this;
        var progress = this.page.getViewById("prgressmultiid");
        progress.value = 0;
        var params = [{ name: "test", value: "value" }, { name: "fileToUpload", filename: this.fileURL, mimeType: 'image/png' }];
        this.task = this.newsession.multipartUpload(params, this.request);
        this.task.on("progress", function (e) {
            var progress = _this.page.getViewById("prgressmultiid");
            progress.value = e.currentBytes;
            progress.maxValue = e.totalBytes;
        });
        this.task.on("error", this.logEvent);
        this.task.on("complete", this.logEvent);
    };
    AppComponent.prototype.imageUplaod = function () {
        var _this = this;
        var progress = this.page.getViewById("prgressid");
        progress.value = 0;
        this.task = this.newsession.uploadFile(this.fileURL, this.request);
        this.task.on("progress", function (e) {
            var progress = _this.page.getViewById("prgressid");
            progress.value = e.currentBytes;
            progress.maxValue = e.totalBytes;
        });
        this.task.on("error", this.logEvent);
        this.task.on("complete", this.logEvent);
    };
    AppComponent.prototype.logEvent = function (e) {
        switch (e.eventName) {
            case "complete":
                alert("Upload complete");
                break;
            case "error":
                alert("Upload error" + e);
                break;
            default:
                break;
        }
    };
    return AppComponent;
}());
__decorate([
    core_1.ViewChild("myImage"),
    __metadata("design:type", core_1.ElementRef)
], AppComponent.prototype, "myImageRef", void 0);
AppComponent = __decorate([
    core_1.Component({
        selector: "ns-app",
        templateUrl: "app.component.html",
    }),
    __metadata("design:paramtypes", [page_1.Page, core_1.NgZone])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNDQUF5RTtBQUN6RSw2RUFBb0U7QUFDcEUsMkNBQTBDO0FBQzFDLGdDQUE2QjtBQUs3QjtJQUFBO0lBSUEsQ0FBQztJQUFELGNBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQU1ELElBQWEsWUFBWTtJQVdyQixzQkFBb0IsSUFBUyxFQUFVLElBQVc7UUFBOUIsU0FBSSxHQUFKLElBQUksQ0FBSztRQUFVLFNBQUksR0FBSixJQUFJLENBQU87UUFUM0MsWUFBTyxHQUFRLEVBQUUsQ0FBQztRQUVsQixjQUFTLEdBQVEsTUFBTSxDQUFDO1FBR3hCLGFBQVEsR0FBRSxZQUFZLENBQUM7UUFLekIsSUFBSSxDQUFDLFNBQVMsR0FBRywwQkFBWSxDQUFDLFVBQVUsRUFBRSxDQUFDO1FBQzNDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUMsV0FBVyxDQUFDO1FBQy9DLElBQUksQ0FBQyxVQUFVLEdBQUcsc0NBQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsT0FBTyxHQUFHO1lBQ1osR0FBRyxFQUFFLHlCQUF5QjtZQUM5QixNQUFNLEVBQUUsTUFBTTtZQUNkLE9BQU8sRUFBRTtnQkFDTCxjQUFjLEVBQUUsMEJBQTBCO2dCQUMxQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVM7YUFDOUI7WUFDRCxXQUFXLEVBQUUsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJO1NBQ3pELENBQUM7SUFDTixDQUFDO0lBQ0Qsa0NBQVcsR0FBWDtRQUFBLGlCQVlDO1FBWEcsSUFBSSxRQUFRLEdBQXNCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDdEUsUUFBUSxDQUFDLEtBQUssR0FBRyxDQUFDLENB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bWVudFJlZiB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge3Nlc3Npb24sIFNlc3Npb24sIFRhc2t9IGZyb20gXCJuYXRpdmVzY3JpcHQtYmFja2dyb3VuZC1odHRwXCI7XG5pbXBvcnQge2tub3duRm9sZGVycyB9IGZyb20gXCJmaWxlLXN5c3RlbVwiO1xuaW1wb3J0IHtQYWdlfSBmcm9tIFwidWkvcGFnZVwiO1xuaW1wb3J0IHtJbWFnZX0gZnJvbSBcInVpL2ltYWdlXCI7XG5pbXBvcnQge1Byb2dyZXNzfSBmcm9tIFwidWkvcHJvZ3Jlc3NcIjtcbmltcG9ydCB7ZnJvbUZpbGUsIEltYWdlU291cmNlfSBmcm9tIFwiaW1hZ2Utc291cmNlXCJcblxuY2xhc3MgdG1wVGFza3tcbiAgICB1cGxvYWQ6IG51bWJlcjtcblxuICAgIHRvdGFsVXBsb2FkOiBudW1iZXI7XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIm5zLWFwcFwiLFxuICAgIHRlbXBsYXRlVXJsOiBcImFwcC5jb21wb25lbnQuaHRtbFwiLFxufSlcbmV4cG9ydCBjbGFzcyBBcHBDb21wb25lbnQgeyBcbiAgICBwdWJsaWMgbmV3c2Vzc2lvbjpTZXNzaW9uO1xuICAgIHB1YmxpYyBmaWxlVVJMOnN0cmluZz1cIlwiO1xuICAgIHB1YmxpYyByZXF1ZXN0OmFueTtcbiAgICBwdWJsaWMgaW1hZ2VOYW1lOnN0cmluZz1cImxvZ29cIjtcbiAgICBwcml2YXRlIGRvY3VtZW50cztcbiAgICBwdWJsaWMgdGFzazpUYXNrO1xuICAgIHB1YmxpYyBpbWFnZVNyYyA9XCJ+L2xvZ28ucG5nXCI7XG5cbiAgICBAVmlld0NoaWxkKFwibXlJbWFnZVwiKSBteUltYWdlUmVmOiBFbGVtZW50UmVmO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBwYWdlOlBhZ2UsIHByaXZhdGUgem9uZTpOZ1pvbmUpe1xuICAgICAgICAgdGhpcy5kb2N1bWVudHMgPSBrbm93bkZvbGRlcnMuY3VycmVudEFwcCgpO1xuICAgICAgICAgdGhpcy5maWxlVVJMID0gdGhpcy5kb2N1bWVudHMucGF0aCtcIi9sb2dvLnBuZ1wiO1xuICAgICAgICAgdGhpcy5uZXdzZXNzaW9uID0gc2Vzc2lvbihcImltYWdlLXVwbG9hZFwiKTtcbiAgICAgICAgIHRoaXMucmVxdWVzdCA9IHtcbiAgICAgICAgICAgIHVybDogXCJodHRwOi8vaHR0cGJpbi5vcmcvcG9zdFwiLFxuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgICBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL29jdGV0LXN0cmVhbVwiLFxuICAgICAgICAgICAgICAgIFwiRmlsZS1OYW1lXCI6IHRoaXMuaW1hZ2VOYW1lXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVzY3JpcHRpb246IFwieyAndXBsb2FkaW5nJzogXCIgKyB0aGlzLmltYWdlTmFtZSArIFwiIH1cIlxuICAgICAgICB9O1xuICAgIH1cbiAgICBtdWx0aVVwbG9hZCgpe1xuICAgICAgICB2YXIgcHJvZ3Jlc3M6UHJvZ3Jlc3MgPTxQcm9ncmVzcz4gdGhpcy5wYWdlLmdldFZpZXdCeUlkKFwicHJncmVzc211bHRpaWRcIik7XG4gICAgICAgICAgICBwcm9ncmVzcy52YWx1ZSA9IDA7XG4gICAgICAgIHZhciBwYXJhbXMgPSBbe25hbWU6IFwidGVzdFwiLCB2YWx1ZTogXCJ2YWx1ZVwifSwge25hbWU6XCJmaWxlVG9VcGxvYWRcIiwgZmlsZW5hbWU6IHRoaXMuZmlsZVVSTCwgbWltZVR5cGU6ICdpbWFnZS9wbmcnfV07XG4gICAgICAgdGhpcy50YXNrID0gdGhpcy5uZXdzZXNzaW9uLm11bHRpcGFydFVwbG9hZChwYXJhbXMsIHRoaXMucmVxdWVzdCk7XG4gICAgICAgdGhpcy50YXNrLm9uKFwicHJvZ3Jlc3NcIiwgKGUpPT57XG4gICAgICAgICAgICB2YXIgcHJvZ3Jlc3M6UHJvZ3Jlc3MgPTxQcm9ncmVzcz4gdGhpcy5wYWdlLmdldFZpZXdCeUlkKFwicHJncmVzc211bHRpaWRcIik7XG4gICAgICAgICAgICBwcm9ncmVzcy52YWx1ZSA9IGUuY3VycmVudEJ5dGVzO1xuICAgICAgICAgICAgcHJvZ3Jlc3MubWF4VmFsdWUgPSBlLnRvdGFsQnl0ZXM7XG4gICAgICAgfSk7XG4gICAgICAgdGhpcy50YXNrLm9uKFwiZXJyb3JcIiwgdGhpcy5sb2dFdmVudCk7XG4gICAgICAgdGhpcy50YXNrLm9uKFwiY29tcGxldGVcIiwgdGhpcy5sb2dFdmVudCk7XG4gICAgfVxuICAgIGltYWdlVXBsYW9kKCl7XG4gICAgICAgIHZhciBwcm9ncmVzczpQcm9ncmVzcyA9PFByb2dyZXNzPiB0aGlzLnBhZ2UuZ2V0Vmlld0J5SWQoXCJwcmdyZXNzaWRcIik7XG4gICAgICAgICAgICBwcm9ncmVzcy52YWx1ZSA9IDA7XG4gICAgICAgdGhpcy50YXNrID0gdGhpcy5uZXdzZXNzaW9uLnVwbG9hZEZpbGUodGhpcy5maWxlVVJMLCB0aGlzLnJlcXVlc3QpO1xuICAgICAgIHRoaXMudGFzay5vbihcInByb2dyZXNzXCIsIChlKT0+e1xuICAgICAgICAgICAgdmFyIHByb2dyZXNzOlByb2dyZXNzID08UHJvZ3Jlc3M+IHRoaXMucGFnZS5nZXRWaWV3QnlJZChcInByZ3Jlc3NpZFwiKTtcbiAgICAgICAgICAgIHByb2dyZXNzLnZhbHVlID0gZS5jdXJyZW50Qnl0ZXM7XG4gICAgICAgICAgICBwcm9ncmVzcy5tYXhWYWx1ZSA9IGUudG90YWxCeXRlcztcbiAgICAgICB9KTtcbiAgICAgICB0aGlzLnRhc2sub24oXCJlcnJvclwiLCB0aGlzLmxvZ0V2ZW50KTtcbiAgICAgICB0aGlzLnRhc2sub24oXCJjb21wbGV0ZVwiLCB0aGlzLmxvZ0V2ZW50KTtcbiAgICAgICBcbiAgICB9XG4gICAgbG9nRXZlbnQoZSkge1xuICAgICAgICBzd2l0Y2ggKGUuZXZlbnROYW1lKSB7XG4gICAgICAgICAgICBjYXNlIFwiY29tcGxldGVcIjpcbiAgICAgICAgICAgICAgICBhbGVydChcIlVwbG9hZCBjb21wbGV0ZVwiKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgXCJlcnJvclwiOlxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiVXBsb2FkIGVycm9yXCIrZSlcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgXG4gICAgICAgXG4gICAgICAgIFxuICAgIH1cbn1cbiJdfQ==