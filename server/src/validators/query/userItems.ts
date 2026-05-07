import z from "zod";

const userItemsListTypes = ["cart", "deleted", "draft", "like", "stock", "uploaded", "watchHistory"] as const;

export type UserItemsListType = (typeof userItemsListTypes)[number];

export const userItemsListQuerySchema = z.object({
    type: z.enum(userItemsListTypes),
    page: z.coerce.number().int().positive().default(1),
    status: z.string().optional(),
    keyword: z.string().optional(),
});

export type UserItemsListQuery = z.infer<typeof userItemsListQuerySchema>;
