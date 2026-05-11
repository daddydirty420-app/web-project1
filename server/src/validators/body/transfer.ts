import z from "zod";

export const transferBodySchema = z.object({
    value: z.number().int().positive().min(1000),
    limit: z.number().int().positive().min(1000),
});

export type TransferBody = z.infer<typeof transferBodySchema>;
