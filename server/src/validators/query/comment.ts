import z from "zod";

const commentPage = ["normal", "admin"] as const;

export type CommentPage = (typeof commentPage)[number];

export const createCommentQuerySchema = z.object({
    sellerMe: z.enum(["true", "false"]).transform((val) => val === "true"),
    parentId: z.coerce.number().int().positive().min(1).optional(),
});

export const commentSortNumberQuerySchema = z.object({
    number: z.coerce.number(),
});

export const commentPageQuerySchema = z.object({
    page: z.enum(commentPage),
});

export const commentSellerMeAdminQuerySchema = z.object({
    sellerMe: z.enum(["true", "false"]).transform((val) => val === "true"),
    admin: z
        .enum(["true", "false"])
        .transform((val) => val === "true")
        .default(false),
});

export type CreateCommentQuery = z.infer<typeof createCommentQuerySchema>;
export type CommentSortNumberQuery = z.infer<typeof commentSortNumberQuerySchema>;
export type CommentPageQuery = z.infer<typeof commentPageQuerySchema>;
export type CommentSellerMeAdminQuery = z.infer<typeof commentSellerMeAdminQuerySchema>;
