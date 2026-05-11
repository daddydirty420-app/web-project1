import z from "zod";

export const profileEditQuerySchema = z.object({
    imageEdit: z.enum(["true", "false"]).transform((val) => val === "true"),
});

export const getProfileQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(6),
});

export type ProfileEditQuery = z.infer<typeof profileEditQuerySchema>;
export type GetProfileQuery = z.infer<typeof getProfileQuerySchema>;
