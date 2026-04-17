import bcrypt from "bcrypt";
import crypto from "crypto";
import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { AppError } from "../errors.js";
import { authenticateToken } from "../middleware/index.js";
import { ShopInfo, TokenEmailChange, User } from "../models/index.js";
import { loginUseCase } from "../usecases/auth/login.js";
import { refreshTokenUseCase } from "../usecases/auth/refreshToken.js";
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

    if (!email) {
        throw new AppError("INVALID_EMAIL", 400, "メールアドレスがありません。");
    } else if (!password) {
        throw new AppError("INVALID_PASSWORD", 400, "パスワードがありません。");
    }

    try {
        const { id, userName, admin, accessToken, refreshToken } = await loginUseCase({ email, password, rememberMe });

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

    try {
        const { expiresAt, reissueUrl } = await signupUseCase({
            email,
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
    const { verificationCode, rememberMe } = req.body;

    try {
        const { id, email, userName, admin, accessToken, refreshToken } = await signupVerifyUseCase({
            verificationCode,
            rememberMe,
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
    const { email } = req.body;

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

router.get("/check-token", authenticateToken, (req: Request, res: Response, next: NextFunction): void => {
    res.status(200).json({ message: "トークン有効", user: req.user });
});

router.post("/rehash-password", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const email = req.body.email?.trim();
    const plainPassword = req.body.password?.trim();

    const user = await User.findOne({ where: { email } });
    if (!user) {
        res.status(404).json({ message: "ユーザーが見つかりません。" });
        return;
    }

    const hashed = await bcrypt.hash(plainPassword, 10);

    user.password = hashed;
    await user.save();

    res.json({ message: "パスワードをハッシュ化して保存しました！" });
});

router.patch(
    "/email-edit",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;
        const newEmail = req.body.email;

        try {
            const user = await User.findByPk(userId);
            if (!user) {
                res.status(404).json({ message: "ユーザーが見つかりません。" });
                return;
            }
            if (newEmail === user.email) {
                res.status(400).json({ message: "現在と異なるメールアドレスを入力してください。" });
                return;
            }

            const token = crypto.randomBytes(20).toString("hex");
            const tokenExpires = new Date(Date.now() + 30 * 60 * 1000);

            await TokenEmailChange.create({
                token_hash: token,
                expires_at: tokenExpires,
                user_id: userId,
                new_email: newEmail,
            });

            const url = `${process.env.CLIENT_URL}/edit/email/new-email/${token}`;

            // メール送信処理

            res.status(200).json({
                message: "新しいメールアドレスにメールを送信しました。メールアドレスの変更はまだ完了しておりません。",
            });
        } catch (err) {
            next(err);
        }
    },
);

router.patch("/new-email-change", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.query.token;

    try {
        const emailTokenData = await TokenEmailChange.findOne({
            where: {
                token_hash: token,
                expires_at: { [Op.gt]: new Date() },
            },
        });
        if (!emailTokenData) {
            res.status(404).json({ message: "新しいメールアドレスデータが見つかりません。" });
            return;
        }

        const userId = emailTokenData.user_id;

        const user = await User.findByPk(userId, {
            include: [
                {
                    model: ShopInfo,
                    where: { verified: true },
                    required: false,
                },
            ],
        });
        if (!user) {
            res.status(404).json({ message: "ユーザーが見つかりません。" });
            return;
        }

        const hasShop = !!user.ShopInfo;

        const newEmail = emailTokenData.new_email;

        await user.update({ email: newEmail });

        if (hasShop) {
            await user.ShopInfo.update({ email: newEmail });
        }

        res.status(200).json({ message: "メールアドレスを更新しました。" });
    } catch (err) {
        next(err);
    }
});

router.post(
    "/check-token",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        res.status(200).json({
            valid: true,
            userId: req.user!.id,
        });
    },
);

router.get("/check-cookies", (req: Request, res: Response, next: NextFunction): void => {
    res.json(req.cookies);
});

router.get("/status", authenticateToken, (req: Request, res: Response, next: NextFunction) => {
    res.json({ loggedIn: true, user: req.user });
});

export default router;
