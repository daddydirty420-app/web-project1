import z from "zod";

export const loginBodySchema = z.object({
    email: z
        .string()
        .trim()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    password: z
        .string()
        .trim()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[0-9])/),
    rememberMe: z.boolean(),
});

export const emailPasswordBodySchema = z.object({
    email: z
        .string()
        .trim()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
    password: z
        .string()
        .trim()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[0-9])/),
});

export const setCookieBodySchema = z.object({
    refreshToken: z.string().min(1),
    rememberMe: z.boolean(),
});

export const verifyTokenBodySchema = z.object({
    token: z.string().min(1),
});

export const signupVerifyBodySchema = z.object({
    verificationCode: z
        .string()
        .length(6)
        .regex(/^[0-9]+$/),
    rememberMe: z.boolean(),
    referenceCode: z.string().optional(),
});

export const emailBodySchema = z.object({
    email: z
        .string()
        .trim()
        .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/),
});

export const resetPWBodySchema = z.object({
    token: z.string(),
    password: z
        .string()
        .trim()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[0-9])/),
});

export const changePWBodySchema = z.object({
    currentPw: z
        .string()
        .trim()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[0-9])/),
    newPw: z
        .string()
        .trim()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[0-9])/),
})

export const refreshTokenOptionalBodySchema = z.object({
    refreshToken: z.string().optional(),
});

export type LoginBody = z.infer<typeof loginBodySchema>;
export type EmailPasswordBody = z.infer<typeof emailPasswordBodySchema>;
export type SetCookieBody = z.infer<typeof setCookieBodySchema>;
export type VerifyTokenBody = z.infer<typeof verifyTokenBodySchema>;
export type SignupVerifyBody = z.infer<typeof signupVerifyBodySchema>;
export type EmailBody = z.infer<typeof emailBodySchema>;
export type ResetPWBody = z.infer<typeof resetPWBodySchema>;
export type ChangePWBody = z.infer<typeof changePWBodySchema>;
export type RefreshTokenOptionalBody = z.infer<typeof refreshTokenOptionalBodySchema>;
