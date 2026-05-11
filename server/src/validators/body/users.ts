import z from "zod";

export const phoneNumberBodySchema = z.object({
    phoneNumber: z
        .string()
        .min(1)
        .transform((val) => val.replace(/[^0-9]/g, ""))
        .pipe(z.string().regex(/^0[0-9]{9,10}$/)),
});

export const profileEditBodySchema = z.object({
    userName: z.string().min(1),
    introduction: z.string().optional().nullable(),
    fileName: z.string().optional(),
    contentType: z.string().optional(),
});

export type PhoneNumberBody = z.infer<typeof phoneNumberBodySchema>;
export type ProfileEditBody = z.infer<typeof profileEditBodySchema>;
