import z from "zod";

export const keywordQuerySchema = z.object({
    keyword: z.string().toLowerCase().trim(),
});

export type KeywordQuery = z.infer<typeof keywordQuerySchema>;
