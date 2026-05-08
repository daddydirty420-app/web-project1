import z from "zod";

export const nameBodySchema = z.object({
    sei: z.string().trim().min(1),
    mei: z.string().trim().min(1),
    seiKana: z.string().trim().min(1),
    meiKana: z.string().trim().min(1),
});

export type NameBody = z.infer<typeof nameBodySchema>;
