declare module "background-http" {

    import observable = require("data/observable");

    /**
     * Get or create a background download/upload session by id.
     */
    export function session(id: string): Session;

    /**
     * Provides error information for error notifications.
     */
    interface ErrorEventData extends observable.EventData {
        /**
         * Provides the underlying error. The value is platform specific.
         */
        error: any;
    }

    /**
     * Provides the current and total bytes of long running transfer tasks.
     */
    interface ProgressEventData extends observable.EventData {
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
     * Encapsulates some information for background http transfers.
     */
    interface Task {
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
         * @param The name of the event to subscribe for.
         * @param The handler called when the event occure.
         */
        on(event: string, handler: (e: observable.EventData) => void): void;

        /**
         * Subscribe for error notifications.
         * @param The name of the event - "error"
         * @param A handler that will receive the error details
         */
        on(event: "error", handler: (e: ErrorEventData) => void);

        /**
         * Subscribe for the transfer progress.
         * @event The name of the event - "progress"
         * @handler A handler that will receive a progress event with the current and expected total bytes 
         */
        on(event: "progress", handler: (e: ProgressEventData) => void);

        /**
         * Subscribe for successful completion of the task
         * @event The name of the event - "complete"
         * @handler A function that will be called with general event data upon successful completion
         */
        on(event: "complete", handler: (e: observable.EventData) => void);
    }

    /**
     * Groups background http tasks in sessions, used to initiate background transfers.
     */
    interface Session {
        /**
         * Initiate a new background file upload task.
         */
        uploadFile(fileUri: string, request: Request): Task;
    }

    /**
     * Encapsulates the information required to initiate new background transfers.
     */
    interface Request {
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
         * Sets the HttpTask's description property.
         * You can as well store serialized JSON object.
         */
        description: string;
    }
}
