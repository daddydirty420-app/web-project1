import z from "zod";

const permitFilesSchema = z.object({
    fileName: z.string(),
    fileType: z.string().nullable(),
    uploaded: z.boolean(),
});

// チェックデジット検証関数
const isValidCompanyNumber = (value: string): boolean => {
    if (!/^[0-9]{13}$/.test(value)) return false;

    const digits = value.split("").map(Number);
    const basicNumber = digits.slice(1); // 12桁の基礎番号

    // 右から数えて偶数桁の合計（インデックスは0始まりなので偶数が偶数桁）
    const evenSum = basicNumber.filter((_, i) => i % 2 === 0).reduce((acc, cur) => acc + cur, 0);

    // 右から数えて奇数桁の合計
    const oddSum = basicNumber.filter((_, i) => i % 2 === 1).reduce((acc, cur) => acc + cur, 0);

    const checkDigit = 9 - ((evenSum * 2 + oddSum) % 9);

    return digits[0] === checkDigit;
};

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

export const createSignup1BBodySchema = z.object({
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
export type CreateSignup1Body = z.infer<typeof createSignup1BBodySchema>;
export type ShopOptionBody = z.infer<typeof shopOptionBodySchema>;
export type ShopSignupEditBody = z.infer<typeof shopSignupEditBodySchema>;
