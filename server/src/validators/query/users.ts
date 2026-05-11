import z from "zod";

export const profileEditQuerySchema = z.object({
    imageEdit: z.enum(["true", "false"]).transform((val) => val === "true"),
});

export type ProfileEditQuery = z.infer<typeof profileEditQuerySchema>;
