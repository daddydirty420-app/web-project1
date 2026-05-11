import z from "zod";

export const createCompanyNameBodySchema = z.object({
    companyName: z.string().min(1),
});

export const comFreeIdBodySchema = z.object({
    selectOption: z.number().int().positive().min(1).max(2),
});

export type CreateCompanyNameBody = z.infer<typeof createCompanyNameBodySchema>;
export type ComFreeIdBody = z.infer<typeof comFreeIdBodySchema>;
