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
    seiValue: z.string().trim().min(1),
    meiValue: z.string().trim().min(1),
    seiKanaValue: z.string().trim().min(1),
    meiKanaValue: z.string().trim().min(1),
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

export type RepNameBody = z.infer<typeof repNameBodySchema>;
export type ShopIdCardBody = z.infer<typeof shopIdCardBodySchema>;
export type CreateSignup1Body = z.infer<typeof createSignup1BBodySchema>;
export type ShopOptionBody = z.infer<typeof shopOptionBodySchema>;
