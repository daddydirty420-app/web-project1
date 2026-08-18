import z from "zod";

const permitFilesSchema = z.object({
    fileName: z.string(),
    fileType: z.string().nullable(),
    uploaded: z.boolean(),
});

export const repNameBodySchema = z.object({
    sei: z.string().trim().min(1),
    mei: z.string().trim().min(1),
    seiKana: z.string().trim().min(1),
    meiKana: z.string().trim().min(1),
    frontFileName: z.string().optional(),
    frontFileType: z.string().optional(),
    rearFileName: z.string().optional(),
    rearFileType: z.string().optional(),
    idFrontUpload: z.boolean().optional(),
    idRearUpload: z.boolean().optional(),
});

export const shopIdCardBodySchema = z.object({
    frontFileName: z.string().optional(),
    frontFileType: z.string().optional(),
    rearFileName: z.string().optional(),
    rearFileType: z.string().optional(),
    idFrontUpload: z.boolean(),
    idRearUpload: z.boolean(),
    permitFiles: z.array(permitFilesSchema),
});

export const shopOptionBodySchema = z.object({
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

export type RepNameBody = z.infer<typeof repNameBodySchema>;
export type ShopIdCardBody = z.infer<typeof shopIdCardBodySchema>;
export type ShopOptionBody = z.infer<typeof shopOptionBodySchema>;
export type ShopSignupEditBody = z.infer<typeof shopSignupEditBodySchema>;
