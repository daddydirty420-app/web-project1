import z from "zod";

export const getPointsHistoryQuerySchema = z.object({
    limit: z.coerce.number().int().positive().min(1).max(1000).default(20),
    cursor: z.string().optional(),
});

export type GetPointHistoryQuery = z.infer<typeof getPointsHistoryQuerySchema>;
