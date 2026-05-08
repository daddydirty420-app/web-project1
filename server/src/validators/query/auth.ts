import z from "zod";

export const newEmailTokenQuerySchema = z.object({
    token: z.string().min(1),
});

export type NewEmailTokenQuery = z.infer<typeof newEmailTokenQuerySchema>;
