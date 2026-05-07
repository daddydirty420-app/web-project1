import z from "zod";

export const deleteReasonBodySchema = z.object({
    deleteReason: z.string(),
});

export type DeleteReasonBody = z.infer<typeof deleteReasonBodySchema>;
