export class ApiError extends Error {
    code: string;

    constructor(code: string) {
        super();
        this.code = code;

        // prototype修正
        Object.setPrototypeOf(this, ApiError.prototype);
    }
}
