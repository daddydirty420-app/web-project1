import z from "zod";

export const optionIdBodySchema = z.object({
    selected: z.number().int().positive().min(1).max(100),
});

export type OptionIdBody = z.infer<typeof optionIdBodySchema>;
