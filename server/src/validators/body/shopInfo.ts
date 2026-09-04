import z from "zod";

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

export const shopOptionBodySchema = z.object({
    autoTrans: z.boolean().default(false),
    openInfo: z.boolean().default(false),
});

export type RepNameBody = z.infer<typeof repNameBodySchema>;
export type ShopOptionBody = z.infer<typeof shopOptionBodySchema>;
