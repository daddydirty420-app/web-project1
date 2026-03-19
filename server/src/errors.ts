export class AppError extends Error {
    statusCode: number;
    code: string;

    constructor(code: string, statusCode: number) {
        super(code);
        this.code = code;
        this.statusCode = statusCode;

        // prototype修正（TSで継承使うときの定番）
        Object.setPrototypeOf(this, AppError.prototype);
    };
};