import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { authenticateToken } from "../middleware/index.js";
import { changeEmailUseCase } from "../usecases/auth/changeEmail.js";
import { loginUseCase } from "../usecases/auth/login.js";
import { changeNewEmailUseCase } from "../usecases/auth/newEmail.js";
import { refreshTokenUseCase } from "../usecases/auth/refreshToken.js";
import { rehashPasswordUseCase } from "../usecases/auth/rehashPassword.js";
import { requestPasswordResetUseCase } from "../usecases/auth/requestPasswordReset.js";
import { resendVerificationCodeUseCase } from "../usecases/auth/resendVerificationCode.js";
import { resetPWUseCase } from "../usecases/auth/resetPW.js";
import { signupUseCase } from "../usecases/auth/signup.js";
import { signupVerifyUseCase } from "../usecases/auth/signupVerify.js";
import { getRefreshTokenCookieOptions } from "../utils/getRefreshCookies.js";

const router = Router();

// POST /auth/login
router.post("/login", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password, rememberMe } = req.body;
    const emailTrim = email.trim();

    if (!password) {
        throw new AppError("INVALID_PASSWORD", 400, "パスワードがありません。");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailTrim)) throw new AppError("INVALID_EMAIL", 400);

    try {
        const { id, userName, admin, accessToken, refreshToken } = await loginUseCase({
            email: emailTrim,
            password,
            rememberMe,
        });

        res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions(rememberMe));

        res.status(200).json({
            id,
            email,
            user_name: userName,
            admin,
            rememberMe,
            accessToken,
            refreshToken,
        });
    } catch (err) {
        next(err);
    }
});

// POST /auth/set-cookie
router.post("/set-cookie", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { refreshToken, rememberMe } = req.body;
    if (!refreshToken) throw new AppError("REFRESH_TOKEN_INVALID", 400);

    res.cookie("refreshToken", refreshToken, getRefreshTokenCookieOptions(rememberMe));

    res.status(200).json({ message: "Cookieをセットしました" });
});

// POST /auth/signup
router.post("/signup", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { email, password } = req.body;
    const emailTrim = email.trim();

    if (!password) {
        throw new AppError("INVALID_PASSWORD", 400, "パスワードがありません。");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(emailTrim)) throw new AppError("INVALID_EMAIL", 400);

    try {
        const { expiresAt, reissueUrl } = await signupUseCase({
            email: emailTrim,
            password,
        });

        res.status(201).json({
            message: "サインアップ成功！認証コードを送信しました！",
            expiresAt,
            reissueUrl,
        });
    } catch (err) {
        next(err);
    }
});

// POST /auth/resend-verification-code
router.post("/resend-verification-code", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token } = req.body;

    if (!token) throw new AppError("TOKEN_INVALID", 400);

    try {
        const { expiresAt, reissueUrl } = await resendVerificationCodeUseCase({
            token,
        });

        res.status(200).json({
            message: "新しい認証コードを発行しました。",
            expiresAt,
            reissueUrl,
        });
    } catch (err) {
        next(err);
    }
});

// POST /auth/signup-verify
router.post("/signup-verify", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { verificationCode, rememberMe, referenceCode } = req.body;

    if (!verificationCode) throw new AppError("INVALID_CODE", 400);

    try {
        const { id, email, userName, admin, accessToken, refreshToken } = await signupVerifyUseCase({
            verificationCode,
            rememberMe,
            referenceCode,
        });

        res.status(200).json({
            id,
            email,
            user_name: userName,
            admin,
            rememberMe,
            accessToken,
            refreshToken,
        });
    } catch (err) {
        next(err);
    }
});

// POST /auth/request-password-reset
router.post("/request-password-reset", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const email = req.body.email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) throw new AppError("INVALID_EMAIL", 400);

    try {
        await requestPasswordResetUseCase({ email });

        res.status(200).json({ message: "メールを送信しました。" });
    } catch (err) {
        next(err);
    }
});

// POST /auth/reset-pw
router.post("/reset-pw", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { token, password } = req.body;

    try {
        await resetPWUseCase({ token, password });

        res.status(200).json({ message: "パスワードを更新しました。" });
    } catch (err) {
        next(err);
    }
});

// POST /auth/refresh-token
router.post("/refresh-token", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const refreshTokenQuery = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!refreshTokenQuery) throw new AppError("INVALID_REFRESH_TOKEN", 401);

    try {
        const { accessToken, refreshToken, exp } = await refreshTokenUseCase({ refreshToken: refreshTokenQuery });

        res.status(200).json({
            accessToken,
            refreshToken,
            exp,
        });
    } catch (err) {
        next(err);
    }
});

// POST /auth/rehash-password
router.post("/rehash-password", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const email = req.body.email?.trim();
    const plainPassword = req.body.password?.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) throw new AppError("INVALID_EMAIL", 400);

    try {
        await rehashPasswordUseCase({ email, plainPassword });

        res.status(200).json({ message: "パスワードをハッシュ化して保存しました！" });
    } catch (err) {
        next(err);
    }
});

// PATCH /auth/email
router.patch("/email", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;
    const newEmail = req.body.email.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(newEmail)) throw new AppError("INVALID_EMAIL", 400);

    try {
        await changeEmailUseCase({ userId, newEmail });

        res.status(200).json({
            message: "新しいメールアドレスにメールを送信しました。メールアドレスの変更はまだ完了しておりません。",
        });
    } catch (err) {
        next(err);
    }
});

// PATCH /auth/new-email
router.patch("/new-email", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = String(req.query.token);

    try {
        await changeNewEmailUseCase({ token });

        res.status(200).json({ message: "メールアドレスを更新しました。" });
    } catch (err) {
        next(err);
    }
});

// GET /auth/status
router.get("/status", authenticateToken, (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "トークン有効", loggedIn: true, user: req.user });
});

export default router;
