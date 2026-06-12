import z from "zod";

export const getTransferHistoryQuerySchema = z.object({
    limit: z.coerce.number().int().positive().min(1).max(1000).default(30),
    cursor: z.string().optional(),
});

export type GetTransferHistoryQuery = z.infer<typeof getTransferHistoryQuerySchema>;
