import z from "zod";

export const addPenaltyBodySchema = z.object({
    addPenalty: z.coerce.number().int().positive(),
});

export const deleteUriageBodySchema = z.object({
    deleteUriage: z.coerce.number().int().positive(),
});

export type AddPenaltyBody = z.infer<typeof addPenaltyBodySchema>;
export type DeleteUriageBody = z.infer<typeof deleteUriageBodySchema>;
