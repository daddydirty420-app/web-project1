export class ApiError extends Error {
    code: string;
    statusCode: number;
    publicMessage?: string;

    constructor(code: string, statusCode: number, publicMessage?: string) {
        super();
        this.code = code;
        this.statusCode = statusCode;
        this.publicMessage = publicMessage;

        // prototype修正
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
