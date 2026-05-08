import z from "zod";

export const optionIdBodySchema = z.object({
    optionId: z.coerce.number().int().positive().min(1).max(100),
});

export type OptionIdBody = z.infer<typeof optionIdBodySchema>;
