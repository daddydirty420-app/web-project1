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
    permitFiles: z.array(filesSchema).max(10),
});

export const shopSignupOptionBodySchema = z.object({
    autoTrans: z.boolean().default(false),
    openInfo: z.boolean().default(false),
});

export const shopConfirmUpdateFieldSchemas = {
    company_name: z.string(),
    phone_number: z.string(),
    email: z.string(),
    open_date_time: z.string(),
    founded_date: z.iso.datetime({ offset: true }),
    member_count: z.union([z.number().int(), z.string().regex(/^-?\d+$/)]),
    homepage_url: z.string(),
    company_number: z.string(),
    capital: z.union([z.number().int(), z.string().regex(/^-?\d+$/)]),
};

export const shopSignupEditBodySchema = z.union([
    z.object({ com_or_free_id: z.number().int().min(1).max(2) }).strict(),
    z.object({ company_name: shopConfirmUpdateFieldSchemas.company_name }).strict(),
    z.object({ shop_name: z.string() }).strict(),
    z.object({ phone_number: shopConfirmUpdateFieldSchemas.phone_number }).strict(),
    z.object({ email: shopConfirmUpdateFieldSchemas.email }).strict(),
    z.object({ open_date_time: shopConfirmUpdateFieldSchemas.open_date_time }).strict(),
    z.object({ founded_date: shopConfirmUpdateFieldSchemas.founded_date }).strict(),
    z.object({ member_count: shopConfirmUpdateFieldSchemas.member_count }).strict(),
    z.object({ homepage_url: shopConfirmUpdateFieldSchemas.homepage_url }).strict(),
    z.object({ company_number: shopConfirmUpdateFieldSchemas.company_number }).strict(),
    z.object({ capital: shopConfirmUpdateFieldSchemas.capital }).strict(),
    z.object({ auto_trans: z.enum(["true", "false"]) }).strict(),
    z.object({ open_info: z.enum(["true", "false"]) }).strict(),
]);

export type CreateSignup1Body = z.infer<typeof createSignup1BodySchema>;
export type ShopSignup3Body = z.infer<typeof shopSignup3BodySchema>;
export type ShopSignupOptionBody = z.infer<typeof shopSignupOptionBodySchema>;
export type ShopSignupEditBody = z.infer<typeof shopSignupEditBodySchema>;
