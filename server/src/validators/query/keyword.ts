import z from "zod";

export const keywordQuerySchema = z.object({
    keyword: z.string().toLowerCase().trim().min(1),
});

export const keywordOptionalQuerySchema = z.object({
    keyword: z.string().toLowerCase().trim().optional(),
});

export type KeywordQuery = z.infer<typeof keywordQuerySchema>;
export type KeywordOptionalQuery = z.infer<typeof keywordOptionalQuerySchema>;
