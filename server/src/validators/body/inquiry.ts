import z from "zod";

export const createInquiryBodySchema = z.object({
    name: z.string().min(1),
    email: z
        .string()
        .trim()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    title: z.string().min(1),
    body: z.string().min(1),
});

export type CreateInquiryBody = z.infer<typeof createInquiryBodySchema>;
