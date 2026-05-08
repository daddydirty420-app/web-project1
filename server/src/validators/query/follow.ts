import z from "zod";

const followTypes = ["follow", "follower"] as const;

export type FollowType = (typeof followTypes)[number];

export const followUserListQuerySchema = z.object({
    type: z.enum(followTypes),
    keyword: z.string().toLowerCase().trim().optional(),
});

export type FollowUserListQuery = z.infer<typeof followUserListQuerySchema>;
