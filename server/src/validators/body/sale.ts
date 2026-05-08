import z from "zod";

export const saleEditBodySchema = z.object({
    discountRate: z.coerce.number().int().positive().default(0),
    discountAmount: z.coerce.number().int().positive().default(0),
    finalPrice: z.coerce.number().int().positive(),
});

export type SaleEditBody = z.infer<typeof saleEditBodySchema>;
