import z from "zod";
import { ACCOUNT_TYPES } from "../../types/bankSnapshot.js";

export const bankBodySchema = z.object({
    bankName: z.string().trim().min(1),
    branch: z.string().trim().min(1),
    accountType: z.enum(ACCOUNT_TYPES),
    accountNumber: z
        .string()
        .trim()
        .min(3)
        .max(40)
        .regex(/^[A-Za-z0-9\s-]+$/),
    meigi: z.string().min(1),
});

export type BankBody = z.infer<typeof bankBodySchema>;
