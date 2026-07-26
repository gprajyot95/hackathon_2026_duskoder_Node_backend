export declare class HttpError extends Error {
    readonly statusCode: number;
    readonly details?: any;
    constructor(message: string, statusCode?: number, details?: any);
}
export declare class BadRequestError extends HttpError {
    constructor(message?: string, details?: any);
}
export declare class NotFoundError extends HttpError {
    constructor(message?: string);
}
export declare class InternalServerError extends HttpError {
    constructor(message?: string);
}
