
export class ApplicationError extends Error {

    public code: number;

    constructor(code: number, message: string, ...args: any) {
        super(...args);
        this.code = code;
        this.message = message;
    }
}

export class BadRequestError extends ApplicationError {

    constructor(message: string, ...args: any) {
        super(400, message, args);
    }
}

export class ServerError extends ApplicationError {

    constructor(message: string, ...args: any) {
        super(500, message, args);
    }
}

export class NotFoundError extends ApplicationError {

    constructor(message: string, ...args: any) {
        super(404, message, args);
    }
}