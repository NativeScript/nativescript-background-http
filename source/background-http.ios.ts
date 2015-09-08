import data_observable = require("data/observable");
import Observable = data_observable.Observable;

var runloop = CFRunLoopGetCurrent();
var defaultRunLoopMode = NSString.stringWithString(kCFRunLoopCommonModes);
function invokeOnMainRunLoop(func) {
    CFRunLoopPerformBlock(runloop, defaultRunLoopMode, func);
    CFRunLoopWakeUp(runloop);
}

var SessionDelegate = NSObject.extend({
	// NSURLSessionDelegate
	URLSessionDidBecomeInvalidWithError: function(session, error) {
		//console.log("URLSessionDidBecomeInvalidWithError:");
		//console.log(" - session: " + session);
		//console.log(" - error:   " + error);
	},
	URLSessionDidReceiveChallengeCompletionHandler: function(session, challenge, comlpetionHandler) {
		//console.log("URLSessionDidFinishEventsForBackgroundURLSession: " + session + " " + challenge);
		var disposition = null;
		var credential = null;
		comlpetionHandler(disposition, credential);
	},
	URLSessionDidFinishEventsForBackgroundURLSession: function(session) {
		//console.log("URLSessionDidFinishEventsForBackgroundURLSession: " + session);
	},

	// NSURLSessionTaskDelegate
	URLSessionTaskDidCompleteWithError: function(session, nsTask, error) {
		var jsTask = getTask(session, nsTask);
		if (error) {
			jsTask.set("status", "error");
			jsTask.notify({ eventName: "error", object: jsTask, error: error });
		} else {
			jsTask.set("upload", nsTask.countOfBytesSent);
			jsTask.set("totalUpload", nsTask.countOfBytesExpectedToSend);

			jsTask.set("status", "complete");
			jsTask.notify({ eventName: "progress", object: jsTask, currentBytes: nsTask.countOfBytesSent, totalBytes: nsTask.countOfBytesExpectedToSend });
			jsTask.notify({ eventName: "complete", object: jsTask });
			
		}
	},
	URLSessionTaskDidReceiveChallengeCompletionHandler: function(session, task, challenge, completionHandler) {
		//console.log("URLSessionTaskDidReceiveChallengeCompletionHandler: " + session + " " + task + " " + challenge);
		var disposition = null;
		var credential = null;
		completionHandler(disposition, credential);
	},
	URLSessionTaskDidSendBodyDataTotalBytesSentTotalBytesExpectedToSend: function(session, task, data, sent, expectedTotal) {
		invokeOnMainRunLoop(function() {
			var jsTask = getTask(session, task);
			jsTask.set("totalUpload", expectedTotal);
			jsTask.set("upload", sent);
			jsTask.set("status", "uploading");
            jsTask.notify({ eventName: "progress", object: jsTask, currentBytes: sent, totalBytes: expectedTotal });
		});
		//console.log("Sending: " + sent + " / " + expectedTotal);
	},
	URLSessionTaskNeedNewBodyStream: function(session, task, need) {
		//console.log("URLSessionTaskNeedNewBodyStream");
	},
	URLSessionTaskWillPerformHTTPRedirectionNewRequestCompletionHandler: function(session, task, redirect, request, completionHandler) {
		//console.log("URLSessionTaskWillPerformHTTPRedirectionNewRequestCompletionHandler");
		completionHandler(request);
	},

	// NSURLSessionDataDelegate
	URLSessionDataTaskDidReceiveResponseCompletionHandler: function(session, dataTask, response, completionHandler) {
		//console.log("URLSessionDataTaskDidReceiveResponseCompletionHandler");
		var disposition = null;
		completionHandler(disposition);
	},
	URLSessionDataTaskDidBecomeDownloadTask: function(session, dataTask, downloadTask) {
		//console.log("URLSessionDataTaskDidBecomeDownloadTask");
	},
	URLSessionDataTaskDidReceiveData: function(session, dataTask, data) {
		//console.log("URLSessionDataTaskDidReceiveData");
		// we have a response in the data...
	},
	URLSessionDataTaskWillCacheResponseCompletionHandler: function() {
		//console.log("URLSessionDataTaskWillCacheResponseCompletionHandler");
	},

	// NSURLSessionDownloadDelegate
	URLSessionDownloadTaskDidResumeAtOffsetExpectedTotalBytes: function(session, task, offset, expects) {
		//console.log("URLSessionDownloadTaskDidResumeAtOffsetExpectedTotalBytes");
	},
	URLSessionDownloadTaskDidWriteDataTotalBytesWrittenTotalBytesExpectedToWrite: function(session, task, data, written, expected) {
		//console.log("URLSessionDownloadTaskDidWriteDataTotalBytesWrittenTotalBytesExpectedToWrite");
	},
	URLSessionDownloadTaskDidFinishDownloadingToURL: function(session, task, url) {
		//console.log("URLSessionDownloadTaskDidFinishDownloadingToURL");
	}
}, {
	name: "BackgroundUploadDelegate",
	protocols: [
		NSURLSessionDelegate,
		NSURLSessionTaskDelegate,
		NSURLSessionDataDelegate,
		NSURLSessionDownloadDelegate
	]
});

// TODO: Create a mechanism to clean sessions from the cache that have all their tasks completed, canceled or errored out.
var sessions = {};
function session(id): Observable {

	var jsSession = sessions[id];
	if (jsSession) {
		return jsSession;
	}

	var delegate = SessionDelegate.alloc().init();
	var configuration = NSURLSessionConfiguration.backgroundSessionConfigurationWithIdentifier(id);
	var session = NSURLSession.sessionWithConfigurationDelegateDelegateQueue(configuration, delegate, null);

	function uploadFile(fileUri, options) {

		var url = NSURL.URLWithString(options.url);
		var request = NSMutableURLRequest.requestWithURL(url);

		var headers = options.headers;
		if (headers) {
			for (var header in headers) {
				var value = headers[header];
                if (value !== null && value !== void 0) {
                    request.setValueForHTTPHeaderField(value.toString(), header);
                }
			}
		}

		if (options.method) {
			request.HTTPMethod = options.method;
		}

		var file = NSURL.URLWithString(fileUri);
		var newTask = session.uploadTaskWithRequestFromFile(request, file);
		newTask.taskDescription = options.description;
		newTask.resume();

		return getTask(session, newTask);
	}

	jsSession = new Observable();
	jsSession.set("ios", session);
	jsSession.set("uploadFile", uploadFile);
	sessions[id] = jsSession;

	return jsSession;
}
exports.session = session;

var tasks = new WeakMap();
function getTask(nsSession, nsTask): Observable {
	var jsTask = <Observable>tasks.get(nsTask);
	if (jsTask) {
		return jsTask;
	}

	jsTask = new Observable();

	jsTask.set("ios", nsTask);
	jsTask.set("session", nsSession);
	jsTask.set("description", nsTask.taskDescription);

	jsTask.set("upload", nsTask.countOfBytesSent);
	jsTask.set("totalUpload", nsTask.countOfBytesExpectedToSend);

	if (nsTask.error) {
		// TODO: Consider adding error property on the task.
		jsTask.set("status", "error");
	} else {
		if (nsTask.state == NSURLSessionTaskState.NSURLSessionTaskStateRunning) {
			jsTask.set("status", "uploading");
		} else if (nsTask.state == NSURLSessionTaskState.NSURLSessionTaskStateCompleted) {
			jsTask.set("status", "complete");
		} else if (nsTask.state == NSURLSessionTaskState.NSURLSessionTaskStateCanceling) {
			jsTask.set("status", "error");
		} else if (nsTask.state == NSURLSessionTaskState.NSURLSessionTaskStateSuspended) {
			jsTask.set("status", "pending");
		}
	}

	// Put in the cache
	tasks.set(nsTask, jsTask);

	return jsTask;
}

