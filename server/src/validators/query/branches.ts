import z from "zod";

export const branchSearchQuerySchema = z.object({
    keyword: z.string().toLowerCase().trim(),
    bankCode: z.string().trim().length(4),
});

export type BranchSearchQuery = z.infer<typeof branchSearchQuerySchema>;
