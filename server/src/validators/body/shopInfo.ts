import z from "zod";

const permitFilesSchema = z.object({
    fileName: z.string(),
    fileType: z.string().nullable(),
    uploaded: z.boolean(),
});

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

export type RepNameBody = z.infer<typeof repNameBodySchema>;
export type ShopIdCardBody = z.infer<typeof shopIdCardBodySchema>;
