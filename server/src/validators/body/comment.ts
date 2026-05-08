import z from "zod";

export const createCommentBodySchema = z.object({
    inputComment: z.string().min(1),
});

export type CreateCommentBody = z.infer<typeof createCommentBodySchema>;
