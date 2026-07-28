export class HttpError extends Error {
    statusCode;
    details;
    constructor(message, statusCode = 500, details) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = details;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class BadRequestError extends HttpError {
    constructor(message = 'Bad Request', details) {
        super(message, 400, details);
    }
}
export class NotFoundError extends HttpError {
    constructor(message = 'Not Found') {
        super(message, 404);
    }
}
export class InternalServerError extends HttpError {
    constructor(message = 'Internal Server Error') {
        super(message, 500);
    }
}
