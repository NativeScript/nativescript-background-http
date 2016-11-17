import { Observable } from "data/observable"
import * as common from "./index"

var main_queue = dispatch_get_current_queue();

class BackgroundUploadDelegate extends NSObject implements NSURLSessionDelegate, NSURLSessionTaskDelegate, NSURLSessionDataDelegate, NSURLSessionDownloadDelegate {

	static ObjCProtocols = [NSURLSessionDelegate, NSURLSessionTaskDelegate, NSURLSessionDataDelegate, NSURLSessionDownloadDelegate];

	// NSURLSessionDelegate
	URLSessionDidBecomeInvalidWithError(session, error) {
		//console.log("URLSessionDidBecomeInvalidWithError:");
		//console.log(" - session: " + session);
		//console.log(" - error:   " + error);
	}

	URLSessionDidReceiveChallengeCompletionHandler(session, challenge, comlpetionHandler) {
		//console.log("URLSessionDidFinishEventsForBackgroundURLSession: " + session + " " + challenge);
		var disposition = null;
		var credential = null;
		comlpetionHandler(disposition, credential);
	}

	URLSessionDidFinishEventsForBackgroundURLSession(session) {
		//console.log("URLSessionDidFinishEventsForBackgroundURLSession: " + session);
	}

	// NSURLSessionTaskDelegate
	URLSessionTaskDidCompleteWithError(session, nsTask, error) {
		dispatch_async(main_queue, () => {
			var task = Task.getTask(session, nsTask);
			if (error) {
				task.notifyPropertyChange("status", task.status);
				task.notify({ eventName: "error", object: task, error: error });
			} else {
				task.notifyPropertyChange("upload", task.upload);
				task.notifyPropertyChange("totalUpload", task.totalUpload);
				task.notify({ eventName: "progress", object: task, currentBytes: nsTask.countOfBytesSent, totalBytes: nsTask.countOfBytesExpectedToSend });
				task.notify({ eventName: "complete", object: task });
				Task._tasks.delete(nsTask);
			}
		});
	}

	URLSessionTaskDidReceiveChallengeCompletionHandler(session, task, challenge, completionHandler) {
		//console.log("URLSessionTaskDidReceiveChallengeCompletionHandler: " + session + " " + task + " " + challenge);
		var disposition = null;
		var credential = null;
		completionHandler(disposition, credential);
	}

	URLSessionTaskDidSendBodyDataTotalBytesSentTotalBytesExpectedToSend(nsSession: NSURLSession, nsTask: NSURLSessionTask, data, sent: number, expectedTotal: number) {
		dispatch_async(main_queue, () => {
			var task = Task.getTask(nsSession, nsTask);
			//console.log("notifyPropertyChange: upload");
			task.notifyPropertyChange("upload", task.upload);
			//console.log("notifyPropertyChange: totalUpload");
			task.notifyPropertyChange("totalUpload", task.totalUpload);
			task.notify({ eventName: "progress", object: task, currentBytes: sent, totalBytes: expectedTotal });
		});
	}

	URLSessionTaskNeedNewBodyStream(session, task, need) {
		//console.log("URLSessionTaskNeedNewBodyStream");
	}

	URLSessionTaskWillPerformHTTPRedirectionNewRequestCompletionHandler(session, task, redirect, request, completionHandler) {
		//console.log("URLSessionTaskWillPerformHTTPRedirectionNewRequestCompletionHandler");
		completionHandler(request);
	}

	// NSURLSessionDataDelegate
	URLSessionDataTaskDidReceiveResponseCompletionHandler(session, dataTask, response, completionHandler) {
		//console.log("URLSessionDataTaskDidReceiveResponseCompletionHandler");
		var disposition = null;
		completionHandler(disposition);
	}

	URLSessionDataTaskDidBecomeDownloadTask(session, dataTask, downloadTask) {
		//console.log("URLSessionDataTaskDidBecomeDownloadTask");
	}

	URLSessionDataTaskDidReceiveData(session, dataTask, data) {
		dispatch_async(main_queue, () => {
			//console.log("URLSessionDataTaskDidReceiveData");
			// we have a response in the data...
			let jsTask = Task.getTask(session, dataTask);
			let jsonString = NSString.alloc().initWithDataEncoding(data, NSUTF8StringEncoding);

			jsTask.notify({ eventName: "responded", object: jsTask, data: jsonString.toString() });
		});
	}

	URLSessionDataTaskWillCacheResponseCompletionHandler() {
		//console.log("URLSessionDataTaskWillCacheResponseCompletionHandler");
	}

	// NSURLSessionDownloadDelegate
	URLSessionDownloadTaskDidResumeAtOffsetExpectedTotalBytes(session, task, offset, expects) {
		//console.log("URLSessionDownloadTaskDidResumeAtOffsetExpectedTotalBytes");
	}

	URLSessionDownloadTaskDidWriteDataTotalBytesWrittenTotalBytesExpectedToWrite(session, task, data, written, expected) {
		//console.log("URLSessionDownloadTaskDidWriteDataTotalBytesWrittenTotalBytesExpectedToWrite");
	}

	URLSessionDownloadTaskDidFinishDownloadingToURL(session, task, url) {
		//console.log("URLSessionDownloadTaskDidFinishDownloadingToURL");
	}
}

class Session implements common.Session {
	// TODO: Create a mechanism to clean sessions from the cache that have all their tasks completed, canceled or errored out.
	private static _sessions: { [id: string]: Session } = {};

	private _session: NSURLSession;

	constructor(id: string) {
		var delegate = BackgroundUploadDelegate.alloc().init();
		var configuration = NSURLSessionConfiguration.backgroundSessionConfigurationWithIdentifier(id);
		this._session = NSURLSession.sessionWithConfigurationDelegateDelegateQueue(configuration, delegate, null);
	}

	get ios(): any {
		return this._session;
	}

	public uploadFile(file: string, options: common.Request) {
		if (!file) {
			throw new Error("File must be provided.");
		}

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

		var fileURL: NSURL;
		if (file.substr(0, 7) === "file://") {
			// File URI in string format
			fileURL = NSURL.URLWithString(file);
		} else if (file.charAt(0) === "/") {
			// Absolute path with leading slash
			fileURL = NSURL.fileURLWithPath(file);
		}

		var newTask = this._session.uploadTaskWithRequestFromFile(request, fileURL);
		newTask.taskDescription = options.description;
		newTask.resume();

		return Task.getTask(this._session, newTask);
	}

	static getSession(id: string): common.Session {
		var jsSession = Session._sessions[id];
		if (jsSession) {
			return jsSession;
		}
		jsSession = new Session(id);
		Session._sessions[id] = jsSession;
		return jsSession;
	}
}

class Task extends Observable implements common.Task {
	public static _tasks = new Map<NSURLSessionTask, Task>();

	private _task: NSURLSessionTask;
	private _session: NSURLSession;

	constructor(nsSession: NSURLSession, nsTask: NSURLSessionTask) {
		super();
		this._task = nsTask;
		this._session = nsSession;
	}

	get ios(): any {
		return this._task;
	}

	get description(): string {
		return this._task.taskDescription;
	}

	get upload(): number {
		return this._task.countOfBytesSent;
	}

	get totalUpload(): number {
		return this._task.countOfBytesExpectedToSend;
	}

	get status(): string {
		if (this._task.error) {
			return "error";
		}
		switch(this._task.state) {
			case NSURLSessionTaskState.Running: return "uploading";
			case NSURLSessionTaskState.Completed: return "complete";
			case NSURLSessionTaskState.Canceling: return "error";
			case NSURLSessionTaskState.Suspended: return "pending";
		}
	}

	public static getTask(nsSession: NSURLSession, nsTask: NSURLSessionTask): Task {
		var task = Task._tasks.get(nsTask);
		if (task) {
			return task;
		}

		task = new Task(nsSession, nsTask);
		Task._tasks.set(nsTask, task);

		return task;
	}
}
export function session(id: string): common.Session {
	return Session.getSession(id);
}
