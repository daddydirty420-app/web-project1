import type { NextFunction, Request, Response } from "express-serve-static-core";
import multer from "multer";

type MultipartField = {
    name: string;
    maxCount: number;
};

const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 },
});

const toBodyFile = (file: Express.Multer.File) => ({
    fileName: file.originalname,
    contentType: file.mimetype,
    size: file.size,
    buffer: file.buffer,
});

export const parseMultipartBody = (fields: MultipartField[]) => [
    upload.fields(fields),
    (req: Request, _res: Response, next: NextFunction): void => {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        for (const field of fields) {
            const bodyFiles = (files?.[field.name] ?? []).map(toBodyFile);
            req.body[field.name] = field.maxCount === 1 ? bodyFiles[0] : bodyFiles;
        }

        next();
    },
];
