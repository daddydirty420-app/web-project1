import z from "zod";

export const phoneNumberBodySchema = z.object({
    phoneNumber: z
        .string()
        .min(1)
        .transform((val) => val.replace(/[^0-9]/g, ""))
        .pipe(z.string().regex(/^0[0-9]{9,10}$/)),
});

export type PhoneNumberBody = z.infer<typeof phoneNumberBodySchema>;
