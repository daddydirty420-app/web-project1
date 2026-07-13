import z from "zod";

export const getPointsHistoryQuerySchema = z.object({
    cursorScore: z.coerce.number().positive().optional(),
    cursorId: z.coerce.number().int().positive().min(1).optional(),
});
export type GetUserCursorQuery = z.infer<typeof getPointsHistoryQuerySchema>;
