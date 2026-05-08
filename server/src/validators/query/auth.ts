import z from "zod";

export const newEmailTokenQuerySchema = z.object({
    token: z.string(),
});

export type NewEmailTokenQuery = z.infer<typeof newEmailTokenQuerySchema>;
