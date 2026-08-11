import z from "zod";

export const getDevItemListQuerySchema = z.object({
    limit: z.coerce.number().int().positive().min(1).max(1000).default(15),
    cursor: z.coerce.number().int().positive().min(1).optional(),
});

export type GetDevItemListQuery = z.infer<typeof getDevItemListQuerySchema>;
