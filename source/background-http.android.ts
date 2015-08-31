var application = require("application");
var frame = require("ui/frame");

var servicePackage = com.alexbbb.uploadservice;

var progressReceiverClass = servicePackage.AbstractUploadServiceReceiver.extend({
    onProgress: function(uploadId, progress) {

    },

    onError: function(uploadId, error) {
        console.log("" + error);
    },

    onCompleted: function(uploadId, responseCode, responseMessage) {
        // TODO: We may want to track active uploads and when there is no such to close the broadcast receiver
    }
})

var uploadServer;
var receiver;
var requestId = 1;
var OPEN_CODE = 100;
var OPEN_AND_UPLOAD_CODE = 1000;

// handle the onActivityResult notification
application.android.on("activityResult", function(e) {
    if(e.resultCode == android.app.Activity.RESULT_CANCELED) {
        // TODO: Raise an error here?
        return;
    }

    if(e.requestCode == OPEN_AND_UPLOAD_CODE) {
        doUpload(e);
    } else {
        // TODO: Think of possible user scenarios that are not related to upload only
    }
});

function queryAbsolutePath(uri) {
    var context = application.android.context;
    var filePathColumn = [android.provider.MediaStore.MediaColumns.DATA];
    var cursor = context.getContentResolver().query(uri, filePathColumn, null, null, null);
    cursor.moveToFirst();
    var columnIndex = cursor.getColumnIndex(filePathColumn[0]);
    var filePath = cursor.getString(columnIndex);
    cursor.close();

    return filePath;
}

function doUpload(args) {
    var intent = args.intent;
    var items = intent.getClipData();
    if(items == null) {
        return;
    }

    var count = items.getItemCount();
    if(count == 0) {
        // no items selected
        return;
    }

    var context = application.android.context;
    var request = new servicePackage.UploadRequest(context, (++requestId).toString(), uploadServer);

    for(var i = 0; i < count; i++) {
        var fileUri = items.getItemAt(i).getUri();
        var filePath = queryAbsolutePath(fileUri);
        request.addFileToUpload(filePath, fileUri.getPath(), null, servicePackage.ContentType.APPLICATION_OCTET_STREAM);
    }

    try {
        servicePackage.UploadService.startUpload(request);
        if(!receiver) {
            receiver = new progressReceiverClass();
            receiver.register(context);
        }
    }
    catch(ex) {
        android.widget.Toast.makeText(
            context, 
            "Malformed upload request. " + ex, 
            android.widget.Toast.LENGTH_SHORT
            )
            .show();
    }
}

exports.init = function(appNamespace, server) {
    servicePackage.UploadService.NAMESPACE = appNamespace;
    uploadServer = server;
}

exports.openUpload = function() {
    if(!uploadServer) {
        throw new Error("No upload server specified. Call init(namespace, server) method.")
    }

    var activity = application.android.currentContext;
    var intent = new android.content.Intent(android.content.Intent.ACTION_PICK);
    intent.setType("image/*");
    intent.putExtra(android.content.Intent.EXTRA_ALLOW_MULTIPLE, true);

    activity.startActivityForResult(intent, OPEN_AND_UPLOAD_CODE);

    // TODO: Return a promise to resolve/reject later
}