import * as observable from "data/observable";

/**
 * Get or create a background download/upload session by id.
 * @param id The session id.
 */
export function session(id: string): Session;

/**
 * Provides error information for error notifications.
 */
export interface ErrorEventData extends observable.EventData {
    /**
     * Provides the underlying error. The value is platform specific.
     */
    error: any;
}

/**
 * Provides the current and total bytes of long running transfer tasks.
 */
export interface ProgressEventData extends observable.EventData {
    /**
     * The bytes transfered so far.
     */
    currentBytes: number;

    /**
     * The expected bytes to transfer.
     */
    totalBytes: number;
}

/**
 * Provides the server responce.
 */
export interface ResultEventData extends observable.EventData {
    /**
     * The string responce of the server.
     */
    data: string;
}

/**
 * Encapsulates some information for background http transfers.
 */
export interface Task {
    /**
     * Get the description of the task, that was provided during the task creation.
     */
    description: string;

    /**
     * Gets the current count of uploaded bytes. (read-only)
     */
    upload: number;

    /**
     * Gets the expected total count of bytes to upload. (read-only)
     */
    totalUpload: number;

    /**
     * Gets the status of the background upload task.
     * Possible states: "panding" | "uploading" | "error" | "complete".
     * (read-only)
     */
    status: string;

    /**
     * Subscribe for a general event.
     * @param event The name of the event to subscribe for.
     * @param The handler called when the event occure.
     * @event
     */
    on(event: string, handler: (e: observable.EventData) => void): void;

    /**
     * Subscribe for error notifications.
     * @param event
     * @param handler A handler that will receive the error details
     * @event
     */
    on(event: "error", handler: (e: ErrorEventData) => void): void;

    /**
     * Subscribe for progress notifications.
     * @param event
     * @param handler A handler that will receive a progress event with the current and expected total bytes 
     * @event
     */
    on(event: "progress", handler: (e: ProgressEventData) => void): void;

    /**
     * Upon successful upload provides the server responce.
     * @param event
     * @param handler A handler that will receive the responce event. 
     * @event
     */
    on(event: "responded", handler: (e: ResultEventData) => void): void;

    /**
     * Subscribe for the success notification.
     * @param event
     * @param handler A function that will be called with general event data upon successful completion
     * @event
     */
    on(event: "complete", handler: (e: observable.EventData) => void): void;
}

/**
 * Groups background http tasks in sessions, used to initiate background transfers.
 */
export interface Session {
    /**
     * Initiate a new background file upload task.
     * @param fileUri A file path to upload.
     * @param options Options for the upload, sets uri, headers, task description etc.
     */
    uploadFile(fileUri: string, options: Request): Task;
    multipartUpload(params: Array<any>, options: any): Task;

}

/**
 * Encapsulates the information required to initiate new background transfers.
 */
export interface Request {
    /**
     * Gets or sets the request url.
     */
    url: string;

    /**
     * Gets or set the HTTP method.
     * By default 'GET' will be used.
     */
    method?: string;

    /**
     * Specify additional HTTP headers.
     */
    headers?: {};

    /**
     * Use this to help you identify the task.
     * Sets the task's description property.
     * You can store serialized JSON object.
     */
    description: string;

    /**
     * Use utf8 encode in requests
     */
    utf8?: boolean;

    /*
     * Use this to set if progress notification should be displayed or not
     */
    androidDisplayNotificationProgress?: boolean;
}
