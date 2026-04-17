export class AppError extends Error {
    statusCode: number;
    code: string;
    publicMessage?: string;

    constructor(code: string, statusCode: number, publicMessage?: string) {
        super(code);
        this.code = code;
        this.statusCode = statusCode;
        this.publicMessage = publicMessage;

        // prototype修正（TSで継承使うときの定番）
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
