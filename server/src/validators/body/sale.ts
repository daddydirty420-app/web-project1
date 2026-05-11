import z from "zod";

export const saleEditBodySchema = z.object({
    discountRate: z.number().int().positive().default(0),
    discountAmount: z.number().int().positive().default(0),
    finalPrice: z.number().int().positive(),
});

export type SaleEditBody = z.infer<typeof saleEditBodySchema>;
