import z from "zod";

export const bankBodySchema = z.object({
    bankName: z.string().trim().min(1),
    branch: z.string().trim().min(1),
    accountType: z.string().trim().min(1),
    accountNumber: z
        .string()
        .trim()
        .min(3)
        .max(40)
        .regex(/^[A-Za-z0-9\s-]+$/),
    meigi: z.string().min(1),
});

export type BankBody = z.infer<typeof bankBodySchema>;
