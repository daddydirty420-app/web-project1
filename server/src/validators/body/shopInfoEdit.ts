import z from "zod";

export const createRepNameBodySchema = z.object({
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

export const createCompanyNameBodySchema = z.object({
    companyName: z.string().min(1),
});

export const comFreeIdBodySchema = z.object({
    selectOption: z.coerce.number().int().positive().min(1).max(2),
});

const permitFilesSchema = z.object({
    fileName: z.string(),
    fileType: z.string().nullable(),
    uploaded: z.boolean(),
});

export const updateShopEditIdCardBodySchema = z.object({
    frontFileName: z.string().optional(),
    frontFileType: z.string().optional(),
    rearFileName: z.string().optional(),
    rearFileType: z.string().optional(),
    idFrontUpload: z.boolean(),
    idRearUpload: z.boolean(),
    permitFiles: z.array(permitFilesSchema),
});

export type CreateRepNameBody = z.infer<typeof createRepNameBodySchema>;
export type CreateCompanyNameBody = z.infer<typeof createCompanyNameBodySchema>;
export type ComFreeIdBody = z.infer<typeof comFreeIdBodySchema>;
export type UpdateShopEditIdCardBody = z.infer<typeof updateShopEditIdCardBodySchema>;
