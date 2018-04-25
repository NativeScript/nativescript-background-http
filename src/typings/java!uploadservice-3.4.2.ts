/* tslint:disable */
import androidcontentContext = android.content.Context;
import javalangClass = java.lang.Class;
import javautilList = java.util.List;
/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./java.lang.Class.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.util.List.d.ts" />
/// <reference path="./net.gotev.uploadservice.HttpUploadRequest.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class BinaryUploadRequest extends net.gotev.uploadservice.HttpUploadRequest {
				public addParameter(param0: string, param1: string): net.gotev.uploadservice.BinaryUploadRequest;
				public constructor(param0: androidcontentContext, param1: string);
				public addArrayParameter(param0: string, param1: javautilList<any>): net.gotev.uploadservice.HttpUploadRequest;
				public constructor(param0: androidcontentContext, param1: string, param2: string);
				public startUpload(): string;
				public addArrayParameter(param0: string, param1: native.Array<string>): net.gotev.uploadservice.BinaryUploadRequest;
				public addParameter(param0: string, param1: string): net.gotev.uploadservice.HttpUploadRequest;
				public addArrayParameter(param0: string, param1: javautilList<any>): net.gotev.uploadservice.BinaryUploadRequest;
				public getTaskClass(): javalangClass<any>;
				public setFileToUpload(param0: string): net.gotev.uploadservice.BinaryUploadRequest;
				public addArrayParameter(param0: string, param1: native.Array<string>): net.gotev.uploadservice.HttpUploadRequest;
			}
		}
	}
}

/// <reference path="./net.gotev.uploadservice.http.BodyWriter.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class BinaryUploadTask extends net.gotev.uploadservice.HttpUploadTask {
				public onBodyReady(param0: net.gotev.uploadservice.http.BodyWriter): void;
				public onBytesWritten(param0: number): void;
				public onSuccessfulUpload(): void;
				public getBodyLength(): number;
				public shouldContinueWriting(): boolean;
				public constructor();
			}
		}
	}
}

import androidcontentIntent = android.content.Intent;
import androidosParcel = android.os.Parcel;
import javalangException = java.lang.Exception;
import androidosParcelableCreator = android.os.Parcelable.Creator;
/// <reference path="./android.content.Intent.d.ts" />
/// <reference path="./android.os.Parcel.d.ts" />
/// <reference path="./java.lang.Exception.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./net.gotev.uploadservice.ServerResponse.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadInfo.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class BroadcastData {
				public static CREATOR: androidosParcelableCreator<any>;
				public getException(): javalangException;
				public writeToParcel(param0: androidosParcel, param1: number): void;
				public setException(param0: javalangException): net.gotev.uploadservice.BroadcastData;
				public getUploadInfo(): net.gotev.uploadservice.UploadInfo;
				public getIntent(): androidcontentIntent;
				public setStatus(param0: net.gotev.uploadservice.BroadcastData.Status): net.gotev.uploadservice.BroadcastData;
				public describeContents(): number;
				public setUploadInfo(param0: net.gotev.uploadservice.UploadInfo): net.gotev.uploadservice.BroadcastData;
				public getServerResponse(): net.gotev.uploadservice.ServerResponse;
				public getStatus(): net.gotev.uploadservice.BroadcastData.Status;
				public setServerResponse(param0: net.gotev.uploadservice.ServerResponse): net.gotev.uploadservice.BroadcastData;
				public constructor();
			}
			export module BroadcastData {
				export class Status {
					public static IN_PROGRESS: net.gotev.uploadservice.BroadcastData.Status;
					public static ERROR: net.gotev.uploadservice.BroadcastData.Status;
					public static COMPLETED: net.gotev.uploadservice.BroadcastData.Status;
					public static CANCELLED: net.gotev.uploadservice.BroadcastData.Status;
					public static values(): native.Array<net.gotev.uploadservice.BroadcastData.Status>;
					public static valueOf(param0: string): net.gotev.uploadservice.BroadcastData.Status;
				}
			}
		}
	}
}

declare module net {
	export module gotev {
		export module uploadservice {
			export class BuildConfig {
				public static DEBUG: boolean;
				public static APPLICATION_ID: string;
				public static BUILD_TYPE: string;
				public static FLAVOR: string;
				public static VERSION_CODE: number;
				public static VERSION_NAME: string;
				public constructor();
			}
		}
	}
}

/// <reference path="./java.lang.String.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class ContentType {
				public static APPLICATION_ENVOY: string;
				public static APPLICATION_FRACTALS: string;
				public static APPLICATION_FUTURESPLASH: string;
				public static APPLICATION_HTA: string;
				public static APPLICATION_INTERNET_PROPERTY_STREAM: string;
				public static APPLICATION_MAC_BINHEX40: string;
				public static APPLICATION_MS_WORD: string;
				public static APPLICATION_OCTET_STREAM: string;
				public static APPLICATION_ODA: string;
				public static APPLICATION_OLESCRIPT: string;
				public static APPLICATION_PDF: string;
				public static APPLICATION_PICS_RULES: string;
				public static APPLICATION_PKCS10: string;
				public static APPLICATION_PKIX_CRL: string;
				public static APPLICATION_POSTSCRIPT: string;
				public static APPLICATION_RTF: string;
				public static APPLICATION_SETPAY: string;
				public static APPLICATION_SETREG: string;
				public static APPLICATION_MS_EXCEL: string;
				public static APPLICATION_MS_OUTLOOK: string;
				public static APPLICATION_MS_PKICERTSTORE: string;
				public static APPLICATION_MS_PKISECCAT: string;
				public static APPLICATION_MS_PKISTL: string;
				public static APPLICATION_MS_POWERPOINT: string;
				public static APPLICATION_MS_PROJECT: string;
				public static APPLICATION_MS_WORKS: string;
				public static APPLICATION_WINHLP: string;
				public static APPLICATION_BCPIO: string;
				public static APPLICATION_CDF: string;
				public static APPLICATION_Z: string;
				public static APPLICATION_TGZ: string;
				public static APPLICATION_CPIO: string;
				public static APPLICATION_CSH: string;
				public static APPLICATION_DIRECTOR: string;
				public static APPLICATION_DVI: string;
				public static APPLICATION_GTAR: string;
				public static APPLICATION_GZIP: string;
				public static APPLICATION_HDF: string;
				public static APPLICATION_INTERNET_SIGNUP: string;
				public static APPLICATION_IPHONE: string;
				public static APPLICATION_JAVASCRIPT: string;
				public static APPLICATION_LATEX: string;
				public static APPLICATION_MS_ACCESS: string;
				public static APPLICATION_MS_CARD_FILE: string;
				public static APPLICATION_MS_CLIP: string;
				public static APPLICATION_MS_DOWNLOAD: string;
				public static APPLICATION_MS_MEDIAVIEW: string;
				public static APPLICATION_MS_METAFILE: string;
				public static APPLICATION_MS_MONEY: string;
				public static APPLICATION_MS_PUBLISHER: string;
				public static APPLICATION_MS_SCHEDULE: string;
				public static APPLICATION_MS_TERMINAL: string;
				public static APPLICATION_MS_WRITE: string;
				public static APPLICATION_NET_CDF: string;
				public static APPLICATION_PERFMON: string;
				public static APPLICATION_PKCS_12: string;
				public static APPLICATION_PKCS_7_CERTIFICATES: string;
				public static APPLICATION_PKCS_7_CERTREQRESP: string;
				public static APPLICATION_PKCS_7_MIME: string;
				public static APPLICATION_PKCS_7_SIGNATURE: string;
				public static APPLICATION_SH: string;
				public static APPLICATION_SHAR: string;
				public static APPLICATION_SHOCKWAVE_FLASH: string;
				public static APPLICATION_STUFFIT: string;
				public static APPLICATION_SV4CPIO: string;
				public static APPLICATION_SV4CRC: string;
				public static APPLICATION_TAR: string;
				public static APPLICATION_TCL: string;
				public static APPLICATION_TEX: string;
				public static APPLICATION_TEXINFO: string;
				public static APPLICATION_TROFF: string;
				public static APPLICATION_TROFF_MAN: string;
				public static APPLICATION_TROFF_ME: string;
				public static APPLICATION_TROFF_MS: string;
				public static APPLICATION_USTAR: string;
				public static APPLICATION_WAIS_SOURCE: string;
				public static APPLICATION_X509_CA_CERT: string;
				public static APPLICATION_PKO: string;
				public static APPLICATION_ZIP: string;
				public static APPLICATION_XML: string;
				public static AUDIO_BASIC: string;
				public static AUDIO_MID: string;
				public static AUDIO_MPEG: string;
				public static AUDIO_AIFF: string;
				public static AUDIO_M3U: string;
				public static AUDIO_REAL_AUDIO: string;
				public static AUDIO_WAV: string;
				public static IMAGE_BMP: string;
				public static IMAGE_COD: string;
				public static IMAGE_GIF: string;
				public static IMAGE_IEF: string;
				public static IMAGE_JPEG: string;
				public static IMAGE_PIPEG: string;
				public static IMAGE_SVG: string;
				public static IMAGE_TIFF: string;
				public static IMAGE_CMU_RASTER: string;
				public static IMAGE_CMX: string;
				public static IMAGE_ICO: string;
				public static IMAGE_PORTABLE_ANYMAP: string;
				public static IMAGE_PORTABLE_BITMAP: string;
				public static IMAGE_PORTABLE_GRAYMAP: string;
				public static IMAGE_PORTABLE_PIXMAP: string;
				public static IMAGE_XRGB: string;
				public static IMAGE_XBITMAP: string;
				public static IMAGE_XPIXMAP: string;
				public static IMAGE_XWINDOWDUMP: string;
				public static TEXT_CSS: string;
				public static TEXT_CSV: string;
				public static TEXT_H323: string;
				public static TEXT_HTML: string;
				public static TEXT_IULS: string;
				public static TEXT_PLAIN: string;
				public static TEXT_RICHTEXT: string;
				public static TEXT_SCRIPTLET: string;
				public static TEXT_TAB_SEPARATED_VALUES: string;
				public static TEXT_VIEWVIEW: string;
				public static TEXT_COMPONENT: string;
				public static TEXT_SETEXT: string;
				public static TEXT_VCARD: string;
				public static TEXT_XML: string;
				public static VIDEO_MPEG: string;
				public static VIDEO_MPEG4: string;
				public static VIDEO_QUICKTIME: string;
				public static VIDEO_LA_ASF: string;
				public static VIDEO_MS_ASF: string;
				public static VIDEO_AVI: string;
				public static VIDEO_MOVIE: string;
				public static autoDetect(param0: string): string;
			}
		}
	}
}

import javalangThrowable = java.lang.Throwable;
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.lang.Throwable.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class DefaultLoggerDelegate {
				public info(param0: string, param1: string): void;
				public debug(param0: string, param1: string): void;
				public error(param0: string, param1: string): void;
				public constructor();
				public error(param0: string, param1: string, param2: javalangThrowable): void;
			}
		}
	}
}

/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./android.content.Intent.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.util.List.d.ts" />
/// <reference path="./net.gotev.uploadservice.HttpUploadTaskParameters.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export abstract class HttpUploadRequest extends net.gotev.uploadservice.UploadRequest {
				public httpParams: net.gotev.uploadservice.HttpUploadTaskParameters;
				public addHeader(param0: string, param1: string): net.gotev.uploadservice.HttpUploadRequest;
				public addArrayParameter(param0: string, param1: javautilList<any>): net.gotev.uploadservice.HttpUploadRequest;
				public setMethod(param0: string): net.gotev.uploadservice.HttpUploadRequest;
				public constructor(param0: androidcontentContext, param1: string, param2: string);
				public setUsesFixedLengthStreamingMode(param0: boolean): net.gotev.uploadservice.HttpUploadRequest;
				public addParameter(param0: string, param1: string): net.gotev.uploadservice.HttpUploadRequest;
				public addArrayParameter(param0: string, param1: native.Array<string>): net.gotev.uploadservice.HttpUploadRequest;
				public initializeIntent(param0: androidcontentIntent): void;
				public setCustomUserAgent(param0: string): net.gotev.uploadservice.HttpUploadRequest;
				public setBasicAuth(param0: string, param1: string): net.gotev.uploadservice.HttpUploadRequest;
			}
		}
	}
}

/// <reference path="./android.content.Intent.d.ts" />
/// <reference path="./net.gotev.uploadservice.HttpUploadTaskParameters.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadService.d.ts" />
/// <reference path="./net.gotev.uploadservice.http.BodyWriter.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export abstract class HttpUploadTask extends net.gotev.uploadservice.UploadTask implements net.gotev.uploadservice.http.HttpConnection.RequestBodyDelegate, net.gotev.uploadservice.http.BodyWriter.OnStreamWriteListener {
				public httpParams: net.gotev.uploadservice.HttpUploadTaskParameters;
				public onBodyReady(param0: net.gotev.uploadservice.http.BodyWriter): void;
				public onBytesWritten(param0: number): void;
				public init(param0: net.gotev.uploadservice.UploadService, param1: androidcontentIntent): void;
				public upload(): void;
				public getBodyLength(): number;
				public shouldContinueWriting(): boolean;
				public constructor();
			}
		}
	}
}

import javautilArrayList = java.util.ArrayList;
/// <reference path="./android.os.Parcel.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.util.ArrayList.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class HttpUploadTaskParameters {
				public static PARAM_HTTP_TASK_PARAMETERS: string;
				public customUserAgent: string;
				public method: string;
				public usesFixedLengthStreamingMode: boolean;
				public static CREATOR: androidosParcelableCreator<any>;
				public getRequestParameters(): javautilArrayList<any>;
				public writeToParcel(param0: androidosParcel, param1: number): void;
				public isCustomUserAgentDefined(): boolean;
				public getRequestHeaders(): javautilArrayList<any>;
				public describeContents(): number;
				public addHeader(param0: string, param1: string): net.gotev.uploadservice.HttpUploadTaskParameters;
				public addParameter(param0: string, param1: string): net.gotev.uploadservice.HttpUploadTaskParameters;
				public constructor();
			}
		}
	}
}

/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.lang.Throwable.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class Logger {
				public static error(param0: string, param1: string, param2: javalangThrowable): void;
				public static resetLoggerDelegate(): void;
				public static setLoggerDelegate(param0: net.gotev.uploadservice.Logger.LoggerDelegate): void;
				public static debug(param0: string, param1: string): void;
				public static info(param0: string, param1: string): void;
				public static setLogLevel(param0: net.gotev.uploadservice.Logger.LogLevel): void;
				public static error(param0: string, param1: string): void;
			}
			export module Logger {
				export class LogLevel {
					public static DEBUG: net.gotev.uploadservice.Logger.LogLevel;
					public static INFO: net.gotev.uploadservice.Logger.LogLevel;
					public static ERROR: net.gotev.uploadservice.Logger.LogLevel;
					public static OFF: net.gotev.uploadservice.Logger.LogLevel;
					public static values(): native.Array<net.gotev.uploadservice.Logger.LogLevel>;
					public static valueOf(param0: string): net.gotev.uploadservice.Logger.LogLevel;
				}
				export class LoggerDelegate {
					/**
					 * Constructs a new instance of the net.gotev.uploadservice.Logger$LoggerDelegate interface with the provided implementation.
					 */
					public constructor(implementation: {
						error(param0: string, param1: string): void;
						error(param0: string, param1: string, param2: javalangThrowable): void;
						debug(param0: string, param1: string): void;
						info(param0: string, param1: string): void;
					});
					public error(param0: string, param1: string, param2: javalangThrowable): void;
					public info(param0: string, param1: string): void;
					public error(param0: string, param1: string): void;
					public debug(param0: string, param1: string): void;
				}
				export class SingletonHolder {
				}
			}
		}
	}
}

/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./android.content.Intent.d.ts" />
/// <reference path="./java.lang.Class.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class MultipartUploadRequest extends net.gotev.uploadservice.HttpUploadRequest {
				public addFileToUpload(param0: string, param1: string): net.gotev.uploadservice.MultipartUploadRequest;
				public constructor(param0: androidcontentContext, param1: string);
				public addFileToUpload(param0: string, param1: string, param2: string, param3: string): net.gotev.uploadservice.MultipartUploadRequest;
				public addFileToUpload(param0: string, param1: string, param2: string): net.gotev.uploadservice.MultipartUploadRequest;
				public constructor(param0: androidcontentContext, param1: string, param2: string);
				public getTaskClass(): javalangClass<any>;
				public setUtf8Charset(): net.gotev.uploadservice.MultipartUploadRequest;
				public initializeIntent(param0: androidcontentIntent): void;
			}
		}
	}
}

/// <reference path="./android.content.Intent.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadService.d.ts" />
/// <reference path="./net.gotev.uploadservice.http.BodyWriter.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class MultipartUploadTask extends net.gotev.uploadservice.HttpUploadTask {
				public static PARAM_UTF8_CHARSET: string;
				public static PROPERTY_REMOTE_FILE_NAME: string;
				public static PROPERTY_CONTENT_TYPE: string;
				public static PROPERTY_PARAM_NAME: string;
				public onBodyReady(param0: net.gotev.uploadservice.http.BodyWriter): void;
				public onBytesWritten(param0: number): void;
				public onSuccessfulUpload(): void;
				public init(param0: net.gotev.uploadservice.UploadService, param1: androidcontentIntent): void;
				public getBodyLength(): number;
				public shouldContinueWriting(): boolean;
				public constructor();
			}
		}
	}
}

import javalangObject = java.lang.Object;
/// <reference path="./android.os.Parcel.d.ts" />
/// <reference path="./java.lang.Object.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class NameValue {
				public static CREATOR: androidosParcelableCreator<any>;
				public writeToParcel(param0: androidosParcel, param1: number): void;
				public static header(param0: string, param1: string): net.gotev.uploadservice.NameValue;
				public equals(param0: javalangObject): boolean;
				public getValue(): string;
				public describeContents(): number;
				public getName(): string;
				public constructor(param0: string, param1: string);
			}
		}
	}
}

/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadInfo.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class Placeholders {
				public static ELAPSED_TIME: string;
				public static UPLOAD_RATE: string;
				public static PROGRESS: string;
				public static UPLOADED_FILES: string;
				public static TOTAL_FILES: string;
				public static replace(param0: string, param1: net.gotev.uploadservice.UploadInfo): string;
				public constructor();
			}
		}
	}
}

import javautilLinkedHashMap = java.util.LinkedHashMap;
/// <reference path="./android.os.Parcel.d.ts" />
/// <reference path="./java.util.LinkedHashMap.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class ServerResponse {
				public static CREATOR: androidosParcelableCreator<any>;
				public constructor(param0: number, param1: native.Array<number>, param2: javautilLinkedHashMap<any, any>);
				public writeToParcel(param0: androidosParcel, param1: number): void;
				public getBodyAsString(): string;
				public getHeaders(): javautilLinkedHashMap<any, any>;
				public constructor(param0: androidosParcel);
				public getBody(): native.Array<number>;
				public describeContents(): number;
				public getHttpCode(): number;
			}
		}
	}
}

import javaioInputStream = java.io.InputStream;
/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./android.os.Parcel.d.ts" />
/// <reference path="./java.io.InputStream.d.ts" />
/// <reference path="./java.lang.Object.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./net.gotev.uploadservice.schemehandlers.SchemeHandler.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class UploadFile {
				public path: string;
				public handler: net.gotev.uploadservice.schemehandlers.SchemeHandler;
				public static CREATOR: androidosParcelableCreator<any>;
				public getName(param0: androidcontentContext): string;
				public getProperty(param0: string, param1: string): string;
				public getStream(param0: androidcontentContext): javaioInputStream;
				public writeToParcel(param0: androidosParcel, param1: number): void;
				public length(param0: androidcontentContext): number;
				public getPath(): string;
				public constructor(param0: string);
				public getContentType(param0: androidcontentContext): string;
				public getProperty(param0: string): string;
				public equals(param0: javalangObject): boolean;
				public hashCode(): number;
				public describeContents(): number;
				public setProperty(param0: string, param1: string): void;
			}
		}
	}
}

import javalangInteger = java.lang.Integer;
/// <reference path="./android.os.Parcel.d.ts" />
/// <reference path="./java.lang.Integer.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.util.ArrayList.d.ts" />
/// <reference path="./java.util.List.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class UploadInfo {
				public static CREATOR: androidosParcelableCreator<any>;
				public getElapsedTimeString(): string;
				public getUploadRate(): number;
				public getUploadedBytes(): number;
				public writeToParcel(param0: androidosParcel, param1: number): void;
				public getProgressPercent(): number;
				public getTotalBytes(): number;
				public constructor(param0: string, param1: number, param2: number, param3: number, param4: number, param5: javautilList<any>, param6: javautilList<any>);
				public getSuccessfullyUploadedFiles(): javautilArrayList<any>;
				public constructor(param0: string);
				public getNotificationID(): javalangInteger;
				public getUploadId(): string;
				public getStartTime(): number;
				public setNotificationID(param0: number): void;
				public getNumberOfRetries(): number;
				public getElapsedTime(): number;
				public getUploadRateString(): string;
				public getFilesLeft(): javautilArrayList<any>;
				public describeContents(): number;
				public getTotalFiles(): number;
			}
		}
	}
}

import androidsupportv4appNotificationCompatAction = android.support.v4.app.NotificationCompat.Action;
import androidappPendingIntent = android.app.PendingIntent;
/// <reference path="./android.app.PendingIntent.d.ts" />
/// <reference path="./android.os.Parcel.d.ts" />
/// <reference path="./java.lang.CharSequence.d.ts" />
/// <reference path="./java.lang.Object.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class UploadNotificationAction {
				public static CREATOR: androidosParcelableCreator<any>;
				public static from(param0: androidsupportv4appNotificationCompatAction): net.gotev.uploadservice.UploadNotificationAction;
				public writeToParcel(param0: androidosParcel, param1: number): void;
				public equals(param0: javalangObject): boolean;
				public constructor(param0: androidosParcel);
				public hashCode(): number;
				public describeContents(): number;
				public constructor(param0: number, param1: string, param2: androidappPendingIntent);
			}
		}
	}
}

import androidgraphicsBitmap = android.graphics.Bitmap;
import javalangBoolean = java.lang.Boolean;
/// <reference path="./android.app.PendingIntent.d.ts" />
/// <reference path="./android.graphics.Bitmap.d.ts" />
/// <reference path="./android.os.Parcel.d.ts" />
/// <reference path="./java.lang.Boolean.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadNotificationAction.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadNotificationStatusConfig.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class UploadNotificationConfig {
				public static CREATOR: androidosParcelableCreator<any>;
				public setIconForAllStatuses(param0: number): net.gotev.uploadservice.UploadNotificationConfig;
				public setClickIntentForAllStatuses(param0: androidappPendingIntent): net.gotev.uploadservice.UploadNotificationConfig;
				public writeToParcel(param0: androidosParcel, param1: number): void;
				public getNotificationChannelId(): string;
				public getProgress(): net.gotev.uploadservice.UploadNotificationStatusConfig;
				public getError(): net.gotev.uploadservice.UploadNotificationStatusConfig;
				public addActionForAllStatuses(param0: net.gotev.uploadservice.UploadNotificationAction): net.gotev.uploadservice.UploadNotificationConfig;
				public setClearOnActionForAllStatuses(param0: boolean): net.gotev.uploadservice.UploadNotificationConfig;
				public isRingToneEnabled(): boolean;
				public setTitleForAllStatuses(param0: string): net.gotev.uploadservice.UploadNotificationConfig;
				public setRingToneEnabled(param0: javalangBoolean): net.gotev.uploadservice.UploadNotificationConfig;
				public getCancelled(): net.gotev.uploadservice.UploadNotificationStatusConfig;
				public setNotificationChannelId(param0: string): net.gotev.uploadservice.UploadNotificationConfig;
				public constructor();
				public getCompleted(): net.gotev.uploadservice.UploadNotificationStatusConfig;
				public setIconColorForAllStatuses(param0: number): net.gotev.uploadservice.UploadNotificationConfig;
				public constructor(param0: androidosParcel);
				public describeContents(): number;
				public setLargeIconForAllStatuses(param0: androidgraphicsBitmap): net.gotev.uploadservice.UploadNotificationConfig;
			}
		}
	}
}

/// <reference path="./android.app.PendingIntent.d.ts" />
/// <reference path="./android.graphics.Bitmap.d.ts" />
/// <reference path="./android.os.Parcel.d.ts" />
/// <reference path="./java.util.ArrayList.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class UploadNotificationStatusConfig {
				public title: string;
				public message: string;
				public autoClear: boolean;
				public iconResourceID: number;
				public largeIcon: androidgraphicsBitmap;
				public iconColorResourceID: number;
				public clickIntent: androidappPendingIntent;
				public clearOnAction: boolean;
				public actions: javautilArrayList<any>;
				public static CREATOR: androidosParcelableCreator<any>;
				public writeToParcel(param0: androidosParcel, param1: number): void;
				public constructor(param0: androidosParcel);
				public describeContents(): number;
				public constructor();
			}
		}
	}
}

/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./android.content.Intent.d.ts" />
/// <reference path="./java.lang.Class.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadNotificationConfig.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadStatusDelegate.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadTaskParameters.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export abstract class UploadRequest {
				public context: androidcontentContext;
				public params: net.gotev.uploadservice.UploadTaskParameters;
				public delegate: net.gotev.uploadservice.UploadStatusDelegate;
				public setAutoDeleteFilesAfterSuccessfulUpload(param0: boolean): net.gotev.uploadservice.UploadRequest;
				public constructor(param0: androidcontentContext, param1: string, param2: string);
				public startUpload(): string;
				public setNotificationConfig(param0: net.gotev.uploadservice.UploadNotificationConfig): net.gotev.uploadservice.UploadRequest;
				public setDelegate(param0: net.gotev.uploadservice.UploadStatusDelegate): net.gotev.uploadservice.UploadRequest;
				public self(): net.gotev.uploadservice.UploadRequest;
				public getTaskClass(): javalangClass<any>;
				public initializeIntent(param0: androidcontentIntent): void;
				public setMaxRetries(param0: number): net.gotev.uploadservice.UploadRequest;
			}
		}
	}
}

import androidosIBinder = android.os.IBinder;
import androidappNotification = android.app.Notification;
/// <reference path="./android.app.Notification.d.ts" />
/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./android.content.Intent.d.ts" />
/// <reference path="./android.os.IBinder.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.util.List.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadStatusDelegate.d.ts" />
/// <reference path="./net.gotev.uploadservice.http.HttpStack.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class UploadService {
				public static UPLOAD_POOL_SIZE: number;
				public static KEEP_ALIVE_TIME_IN_SECONDS: number;
				public static IDLE_TIMEOUT: number;
				public static EXECUTE_IN_FOREGROUND: boolean;
				public static NAMESPACE: string;
				public static HTTP_STACK: net.gotev.uploadservice.http.HttpStack;
				public static BUFFER_SIZE: number;
				public static INITIAL_RETRY_WAIT_TIME: number;
				public static BACKOFF_MULTIPLIER: number;
				public static MAX_RETRY_WAIT_TIME: number;
				public static UPLOAD_NOTIFICATION_BASE_ID: number;
				public static PROGRESS_REPORT_INTERVAL: number;
				public static PARAM_TASK_PARAMETERS: string;
				public static PARAM_TASK_CLASS: string;
				public static PARAM_BROADCAST_DATA: string;
				public onStartCommand(param0: androidcontentIntent, param1: number, param2: number): number;
				public static stop(param0: androidcontentContext): boolean;
				public holdForegroundNotification(param0: string, param1: androidappNotification): boolean;
				public static stop(param0: androidcontentContext, param1: boolean): boolean;
				public constructor();
				public static getTaskList(): javautilList<any>;
				public taskCompleted(param0: string): void;
				public onBind(param0: androidcontentIntent): androidosIBinder;
				public static stopAllUploads(): void;
				public static getActionBroadcast(): string;
				public onCreate(): void;
				public onDestroy(): void;
				public static getActionUpload(): string;
				public static setUploadStatusDelegate(param0: string, param1: net.gotev.uploadservice.UploadStatusDelegate): void;
				public static getUploadStatusDelegate(param0: string): net.gotev.uploadservice.UploadStatusDelegate;
				public static stopUpload(param0: string): void;
			}
		}
	}
}

/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./android.content.Intent.d.ts" />
/// <reference path="./java.lang.Exception.d.ts" />
/// <reference path="./net.gotev.uploadservice.ServerResponse.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadInfo.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class UploadServiceBroadcastReceiver {
				public register(param0: androidcontentContext): void;
				public onProgress(param0: androidcontentContext, param1: net.gotev.uploadservice.UploadInfo): void;
				public onCancelled(param0: androidcontentContext, param1: net.gotev.uploadservice.UploadInfo): void;
				public onError(param0: androidcontentContext, param1: net.gotev.uploadservice.UploadInfo, param2: net.gotev.uploadservice.ServerResponse, param3: javalangException): void;
				public onReceive(param0: androidcontentContext, param1: androidcontentIntent): void;
				public unregister(param0: androidcontentContext): void;
				public onCompleted(param0: androidcontentContext, param1: net.gotev.uploadservice.UploadInfo, param2: net.gotev.uploadservice.ServerResponse): void;
				public shouldAcceptEventFrom(param0: net.gotev.uploadservice.UploadInfo): boolean;
				public constructor();
			}
		}
	}
}

/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./java.lang.Exception.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./net.gotev.uploadservice.ServerResponse.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadInfo.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadStatusDelegate.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class UploadServiceSingleBroadcastReceiver extends net.gotev.uploadservice.UploadServiceBroadcastReceiver {
				public constructor(param0: net.gotev.uploadservice.UploadStatusDelegate);
				public onProgress(param0: androidcontentContext, param1: net.gotev.uploadservice.UploadInfo): void;
				public setUploadID(param0: string): void;
				public onCancelled(param0: androidcontentContext, param1: net.gotev.uploadservice.UploadInfo): void;
				public onError(param0: androidcontentContext, param1: net.gotev.uploadservice.UploadInfo, param2: net.gotev.uploadservice.ServerResponse, param3: javalangException): void;
				public onCompleted(param0: androidcontentContext, param1: net.gotev.uploadservice.UploadInfo, param2: net.gotev.uploadservice.ServerResponse): void;
				public shouldAcceptEventFrom(param0: net.gotev.uploadservice.UploadInfo): boolean;
				public constructor();
			}
		}
	}
}

/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./java.lang.Exception.d.ts" />
/// <reference path="./net.gotev.uploadservice.ServerResponse.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadInfo.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class UploadStatusDelegate {
				/**
				 * Constructs a new instance of the net.gotev.uploadservice.UploadStatusDelegate interface with the provided implementation.
				 */
				public constructor(implementation: {
					onProgress(param0: androidcontentContext, param1: net.gotev.uploadservice.UploadInfo): void;
					onError(param0: androidcontentContext, param1: net.gotev.uploadservice.UploadInfo, param2: net.gotev.uploadservice.ServerResponse, param3: javalangException): void;
					onCompleted(param0: androidcontentContext, param1: net.gotev.uploadservice.UploadInfo, param2: net.gotev.uploadservice.ServerResponse): void;
					onCancelled(param0: androidcontentContext, param1: net.gotev.uploadservice.UploadInfo): void;
				});
				public onProgress(param0: androidcontentContext, param1: net.gotev.uploadservice.UploadInfo): void;
				public onCancelled(param0: androidcontentContext, param1: net.gotev.uploadservice.UploadInfo): void;
				public onError(param0: androidcontentContext, param1: net.gotev.uploadservice.UploadInfo, param2: net.gotev.uploadservice.ServerResponse, param3: javalangException): void;
				public onCompleted(param0: androidcontentContext, param1: net.gotev.uploadservice.UploadInfo, param2: net.gotev.uploadservice.ServerResponse): void;
			}
		}
	}
}

/// <reference path="./android.content.Intent.d.ts" />
/// <reference path="./java.util.List.d.ts" />
/// <reference path="./net.gotev.uploadservice.ServerResponse.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadFile.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadService.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadTaskParameters.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export abstract class UploadTask {
				public static TASK_COMPLETED_SUCCESSFULLY: number;
				public static EMPTY_RESPONSE: native.Array<number>;
				public service: net.gotev.uploadservice.UploadService;
				public params: net.gotev.uploadservice.UploadTaskParameters;
				public shouldContinue: boolean;
				public totalBytes: number;
				public uploadedBytes: number;
				public broadcastProgress(param0: number, param1: number): void;
				public broadcastCompleted(param0: net.gotev.uploadservice.ServerResponse): void;
				public setLastProgressNotificationTime(param0: number): net.gotev.uploadservice.UploadTask;
				public addAllFilesToSuccessfullyUploadedFiles(): void;
				public constructor();
				public addSuccessfullyUploadedFile(param0: net.gotev.uploadservice.UploadFile): void;
				public run(): void;
				public setNotificationId(param0: number): net.gotev.uploadservice.UploadTask;
				public onSuccessfulUpload(): void;
				public getSuccessfullyUploadedFiles(): javautilList<any>;
				public cancel(): void;
				public upload(): void;
				public init(param0: net.gotev.uploadservice.UploadService, param1: androidcontentIntent): void;
				public broadcastCancelled(): void;
			}
		}
	}
}

/// <reference path="./android.os.Parcel.d.ts" />
/// <reference path="./java.util.ArrayList.d.ts" />
/// <reference path="./net.gotev.uploadservice.UploadNotificationConfig.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export class UploadTaskParameters {
				public id: string;
				public serverUrl: string;
				public autoDeleteSuccessfullyUploadedFiles: boolean;
				public notificationConfig: net.gotev.uploadservice.UploadNotificationConfig;
				public files: javautilArrayList<any>;
				public static CREATOR: androidosParcelableCreator<any>;
				public setMaxRetries(param0: number): net.gotev.uploadservice.UploadTaskParameters;
				public writeToParcel(param0: androidosParcel, param1: number): void;
				public describeContents(): number;
				public getMaxRetries(): number;
				public constructor();
			}
		}
	}
}

/// <reference path="./java.io.InputStream.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export module http {
				export abstract class BodyWriter {
					public write(param0: native.Array<number>): void;
					public constructor();
					public flush(): void;
					public writeStream(param0: javaioInputStream, param1: net.gotev.uploadservice.http.BodyWriter.OnStreamWriteListener): void;
					public write(param0: native.Array<number>, param1: number): void;
				}
				export module BodyWriter {
					export class OnStreamWriteListener {
						/**
						 * Constructs a new instance of the net.gotev.uploadservice.http.BodyWriter$OnStreamWriteListener interface with the provided implementation.
						 */
						public constructor(implementation: {
							shouldContinueWriting(): boolean;
							onBytesWritten(param0: number): void;
						});
						public onBytesWritten(param0: number): void;
						public shouldContinueWriting(): boolean;
					}
				}
			}
		}
	}
}

/// <reference path="./java.util.List.d.ts" />
/// <reference path="./net.gotev.uploadservice.ServerResponse.d.ts" />
/// <reference path="./net.gotev.uploadservice.http.BodyWriter.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export module http {
				export class HttpConnection {
					/**
					 * Constructs a new instance of the net.gotev.uploadservice.http.HttpConnection interface with the provided implementation.
					 */
					public constructor(implementation: {
						setHeaders(param0: javautilList<any>): net.gotev.uploadservice.http.HttpConnection;
						setTotalBodyBytes(param0: number, param1: boolean): net.gotev.uploadservice.http.HttpConnection;
						getResponse(param0: net.gotev.uploadservice.http.HttpConnection.RequestBodyDelegate): net.gotev.uploadservice.ServerResponse;
						close(): void;
					});
					public setTotalBodyBytes(param0: number, param1: boolean): net.gotev.uploadservice.http.HttpConnection;
					public close(): void;
					public getResponse(param0: net.gotev.uploadservice.http.HttpConnection.RequestBodyDelegate): net.gotev.uploadservice.ServerResponse;
					public setHeaders(param0: javautilList<any>): net.gotev.uploadservice.http.HttpConnection;
				}
				export module HttpConnection {
					export class RequestBodyDelegate {
						/**
						 * Constructs a new instance of the net.gotev.uploadservice.http.HttpConnection$RequestBodyDelegate interface with the provided implementation.
						 */
						public constructor(implementation: {
							onBodyReady(param0: net.gotev.uploadservice.http.BodyWriter): void;
						});
						public onBodyReady(param0: net.gotev.uploadservice.http.BodyWriter): void;
					}
				}
			}
		}
	}
}

/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./net.gotev.uploadservice.http.HttpConnection.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export module http {
				export class HttpStack {
					/**
					 * Constructs a new instance of the net.gotev.uploadservice.http.HttpStack interface with the provided implementation.
					 */
					public constructor(implementation: {
						createNewConnection(param0: string, param1: string): net.gotev.uploadservice.http.HttpConnection;
					});
					public createNewConnection(param0: string, param1: string): net.gotev.uploadservice.http.HttpConnection;
				}
			}
		}
	}
}

import javaioOutputStream = java.io.OutputStream;
/// <reference path="./java.io.OutputStream.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export module http {
				export module impl {
					export class HurlBodyWriter extends net.gotev.uploadservice.http.BodyWriter {
						public constructor();
						public flush(): void;
						public write(param0: native.Array<number>): void;
						public write(param0: native.Array<number>, param1: number): void;
						public constructor(param0: javaioOutputStream);
					}
				}
			}
		}
	}
}

/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./net.gotev.uploadservice.http.HttpConnection.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export module http {
				export module impl {
					export class HurlStack {
						public constructor(param0: boolean, param1: boolean, param2: number, param3: number);
						public constructor();
						public createNewConnection(param0: string, param1: string): net.gotev.uploadservice.http.HttpConnection;
					}
				}
			}
		}
	}
}

/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./java.util.List.d.ts" />
/// <reference path="./net.gotev.uploadservice.ServerResponse.d.ts" />
/// <reference path="./net.gotev.uploadservice.http.HttpConnection.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export module http {
				export module impl {
					export class HurlStackConnection {
						public getResponse(param0: net.gotev.uploadservice.http.HttpConnection.RequestBodyDelegate): net.gotev.uploadservice.ServerResponse;
						public close(): void;
						public constructor(param0: string, param1: string, param2: boolean, param3: boolean, param4: number, param5: number);
						public setHeaders(param0: javautilList<any>): net.gotev.uploadservice.http.HttpConnection;
						public setTotalBodyBytes(param0: number, param1: boolean): net.gotev.uploadservice.http.HttpConnection;
					}
				}
			}
		}
	}
}

/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./java.io.InputStream.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export module schemehandlers {
				export class ContentSchemeHandler {
					public init(param0: string): void;
					public getInputStream(param0: androidcontentContext): javaioInputStream;
					public getContentType(param0: androidcontentContext): string;
					public getLength(param0: androidcontentContext): number;
					public getName(param0: androidcontentContext): string;
				}
			}
		}
	}
}

/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./java.io.InputStream.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export module schemehandlers {
				export class FileSchemeHandler {
					public init(param0: string): void;
					public getInputStream(param0: androidcontentContext): javaioInputStream;
					public getContentType(param0: androidcontentContext): string;
					public getLength(param0: androidcontentContext): number;
					public getName(param0: androidcontentContext): string;
				}
			}
		}
	}
}

/// <reference path="./android.content.Context.d.ts" />
/// <reference path="./java.io.InputStream.d.ts" />
/// <reference path="./java.lang.String.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export module schemehandlers {
				export class SchemeHandler {
					/**
					 * Constructs a new instance of the net.gotev.uploadservice.schemehandlers.SchemeHandler interface with the provided implementation.
					 */
					public constructor(implementation: {
						init(param0: string): void;
						getLength(param0: androidcontentContext): number;
						getInputStream(param0: androidcontentContext): javaioInputStream;
						getContentType(param0: androidcontentContext): string;
						getName(param0: androidcontentContext): string;
					});
					public init(param0: string): void;
					public getInputStream(param0: androidcontentContext): javaioInputStream;
					public getContentType(param0: androidcontentContext): string;
					public getLength(param0: androidcontentContext): number;
					public getName(param0: androidcontentContext): string;
				}
			}
		}
	}
}

/// <reference path="./java.lang.String.d.ts" />
/// <reference path="./net.gotev.uploadservice.schemehandlers.SchemeHandler.d.ts" />
declare module net {
	export module gotev {
		export module uploadservice {
			export module schemehandlers {
				export class SchemeHandlerFactory {
					public get(param0: string): net.gotev.uploadservice.schemehandlers.SchemeHandler;
					public static getInstance(): net.gotev.uploadservice.schemehandlers.SchemeHandlerFactory;
					public isSupported(param0: string): boolean;
				}
				export module SchemeHandlerFactory {
					export class LazyHolder {
					}
				}
			}
		}
	}
}

