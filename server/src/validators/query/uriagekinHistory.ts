import z from "zod";

export const getUriagekinHistoryQuerySchema = z.object({
    limit: z.coerce.number().int().positive().min(1).max(1000).default(30),
    cursor: z.string().optional(),
});

export type GetUriagekinHistoryQuery = z.infer<typeof getUriagekinHistoryQuerySchema>;
