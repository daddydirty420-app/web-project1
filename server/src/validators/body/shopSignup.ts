import z from "zod";
import { isValidCompanyNumber } from "../../utils/isValidCompanyNumber.js";

export const createSignup1BodySchema = z.object({
    selectOption: z.number().int().positive().min(1).max(2),
    companyName: z.string().min(1),
    shopName: z.string().min(1),
    phoneNumber: z
        .string()
        .min(1)
        .transform((val) => val.replace(/[^0-9]/g, ""))
        .pipe(z.string().regex(/^0[0-9]{9,10}$/)),
    email: z
        .string()
        .trim()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    openDateTime: z.string().min(1),
    foundedDate: z.date().max(new Date()),
    memberCount: z.number().int().positive().min(1).max(1000000),
    homepage: z.string().optional(),
    repSei: z.string().trim().min(1),
    repMei: z.string().trim().min(1),
    repSeiKana: z.string().trim().min(1),
    repMeiKana: z.string().trim().min(1),
    conSei: z.string().trim().min(1),
    conMei: z.string().trim().min(1),
    conSeiKana: z.string().trim().min(1),
    conMeiKana: z.string().trim().min(1),
    postNumber: z
        .string()
        .trim()
        .length(7)
        .transform((val) => val.replace(/-/g, ""))
        .pipe(z.string().regex(/^[0-9]{7}$/)),
    todouhuken: z.string().trim().min(1),
    shikutyouson: z.string().trim().min(1),
    banchi: z.string().trim().min(1),
    building: z.string().trim().optional(),
    companyNumber: z
        .string()
        .trim()
        .optional()
        .refine((val) => val === undefined || val === "" || isValidCompanyNumber(val)),
    capital: z.number().int().optional(),
});

export const filesSchema = z.object({
    fileName: z.string(),
    contentType: z.string().min(1),
    size: z.number().int().positive(),
    buffer: z.instanceof(Buffer),
});

export const shopSignup3BodySchema = z.object({
    frontIdCard: filesSchema,
    rearIdCard: filesSchema,
    permitFiles: z.array(filesSchema),
});

export type CreateSignup1Body = z.infer<typeof createSignup1BodySchema>;
export type ShopSignup3Body = z.infer<typeof shopSignup3BodySchema>;
