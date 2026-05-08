import z from "zod";

export const zipcodeQuerySchema = z.object({
    zipcode: z
        .string()
        .trim()
        .length(7)
        .transform((val) => val.replace(/-/g, ""))
        .pipe(z.string().regex(/^[0-9]{7}$/)),
});

export type ZipcodeQuery = z.infer<typeof zipcodeQuerySchema>;
