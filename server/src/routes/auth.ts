import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateAccessToken, generateRefreshToken } from "../utils/jwtHelper.js";
import { authenticateToken } from "../middleware/index.js";
import { User, TokenSignupVerification, TokenPasswordReset, TokenEmailChange, RefreshTokens, Address, Name, BankAccount, IdCard, ShopInfo } from "../models/index.js";
import sequelize from "../db.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";
import { getRefreshTokenCookieOptions } from "../utils/getRefreshCookies.js";
import { AppError } from "../errors.js";
import { loginUseCase } from "../usecases/auth/login.js";
import { signupUseCase } from "../usecases/auth/signup.js";
import { resendVerificationCodeUseCase } from "../usecases/auth/resendVerificationCode.js";

const router = Router();

type DecodedAccessToken = {
  id: number | string;
  email: string;
  type: "access";
  iat?: number;
  exp?: number;
};

// POST /auth/login
router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password, rememberMe } = req.body;

  if (!email) {
    throw new AppError("INVALID_EMAIL", 400, "メールアドレスがありません。");
  } else if (!password) {
    throw new AppError("INVALID_PASSWORD", 400, "パスワードがありません。");
  }

  try {
    const {
      id,
      userName,
      admin,
      accessToken,
      refreshToken
    } = await loginUseCase({ email, password, rememberMe });

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
router.post('/signup', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, password } = req.body;

  try {
    const {
      expiresAt,
      reissueUrl
    } = await signupUseCase({ email, password });

    res.status(201).json({
      message: 'サインアップ成功！認証コードを送信しました！',
      expiresAt,
      reissueUrl
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/resend-verification-code
router.post('/resend-verification-code', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { token } = req.body;

  if (!token) throw new AppError("TOKEN_INVALID", 400);

  try {
    const {
      expiresAt,
      reissueUrl
    } = await resendVerificationCodeUseCase({ token });

    res.status(200).json({
      message: '新しい認証コードを発行しました。',
      expiresAt,
      reissueUrl
    });
  } catch (err) {
    next(err);
  }
});

// POST /auth/signup-verify
router.post('/signup-verify', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { verificationCode, rememberMe } = req.body;

  const t = await sequelize.transaction();

  try {
    const tokenRecord = await TokenSignupVerification.findOne({
      where: { verification_code: verificationCode },
      transaction: t
    });

    if (!tokenRecord) {
      await t.rollback();
      res.status(400).json({ message: '認証コードが正しくありません。' });
      return;
    }

    if (Date.now() > tokenRecord.verification_code_expires.getTime()) {
      await tokenRecord.destroy({ transaction: t });
      await t.commit();
      res.status(400).json({ message: '認証コードの有効期限が過ぎております。' });
      return;
    }

    const user = await User.findByPk(tokenRecord.user_id, { transaction: t });
    if (!user) {
      await tokenRecord.destroy({ transaction: t });
      await t.commit();
      res.status(404).json({ message: 'ユーザーが見つかりません。' });
      return;
    }

    const userId = user.id;

    await user.update({ email_verified: true }, { transaction: t });

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user, rememberMe);

    await RefreshTokens.create({
      token: newRefreshToken,
      user_id: userId,
      expires_at: rememberMe
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    }, { transaction: t });

    await Address.create({ user_id: userId }, { transaction: t });
    await Name.create({ user_id: userId }, { transaction: t });
    await BankAccount.create({ user_id: userId }, { transaction: t });
    await IdCard.create({ user_id: userId }, { transaction: t });

    await tokenRecord.destroy({ transaction: t });

    await t.commit();

    res.status(200).json({
      id: userId,
      email: user.email,
      user_name: user.user_name,
      admin: user.admin,
      rememberMe,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    await t.rollback();
    next(err);
  }
});

router.post('/request-password-reset', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(200).json({ message: 'メールを送信しました。' });
      return;
    };

    const newResetToken = crypto.randomBytes(20).toString('hex');
    const newResetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    await TokenPasswordReset.create({
      token_hash: newResetToken,
      expires_at: newResetTokenExpires,
      user_id: user.id
    });

    const resetUrl = `${process.env.CLIENT_URL}/login/new-pw/${newResetToken}`;

    // メール送信処理

    res.status(200).json({ message: 'メールを送信しました。' });
  } catch (err) {
    next(err);
  }
});

router.post('/reset-pw', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { token, password } = req.body;

  try {
    const resetRecord = await TokenPasswordReset.findOne({ where: { token_hash: token } });
    if (!resetRecord || resetRecord.expires_at < Date.now()) {
      res.status(400).json({ message: '無効または期限切れのトークンです。' });
      return;
    }

    const user = await User.findOne({ where: { id: resetRecord.user_id } });
    if (!user) {
      res.status(401).json({ message: 'ユーザーが見つかりません。' });
      return;
    }

    if (!user.email_verified) {
      await resetRecord.destroy();
      res.status(403).json({ message: 'このアカウントは有効ではありません。' });
      return;
    }

    const regex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    if (!regex.test(password)) {
      res.status(400).json({ message: 'パスワードは8文字以上の半角英数字で、小文字と数字を含めてください。' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    await user.save();

    await resetRecord.destroy();

    res.status(200).json({ message: 'パスワードを更新しました。' });
  } catch (err) {
    next(err);
  }
});

router.post("/refresh-token", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  if (!refreshToken) {
    res.status(400).json({ message: "refreshTokenがありません。" });
    return;
  }

  try {
    const storedToken = await RefreshTokens.findOne({ where: { token: refreshToken } });
    if (!storedToken) {
      res.status(401).json({ message: "無効なトークンです。" });
      return;
    }

    if (new Date() > storedToken.expires_at) {
      res.status(401).json({ message: "トークンの有効期限が切れています。" });
      return;
    }

    let decoded: any;
    try {
      decoded = jwt.verify(refreshToken, process.env.NEXTAUTH_SECRET!);
    } catch (err) {
      await storedToken.destroy();
      res.status(401).json({ message: "無効なトークンです。" });
      return;
    }

    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.status(404).json({ message: "ユーザーが見つかりません。" });
      return;
    }

    const newAccessToken = generateAccessToken(user);

    const newDecoded = jwt.decode(newAccessToken) as DecodedAccessToken | null;

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: storedToken.token,
      exp: newDecoded?.exp,
    });
  } catch (err) {
    next(err);
  }
});

router.get('/check-token', authenticateToken, (req: Request, res: Response, next: NextFunction): void => {
    res.json({ message: 'トークン有効', user: req.user });
});

router.post('/rehash-password', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const email = req.body.email?.trim();
  const plainPassword = req.body.password?.trim();

  const user = await User.findOne({ where: { email } });
  if (!user) {
    res.status(404).json({ message: 'ユーザーが見つかりません。' });
    return;
  }

  const hashed = await bcrypt.hash(plainPassword, 10);

  user.password = hashed;
  await user.save();

  res.json({ message: 'パスワードをハッシュ化して保存しました！' });
});

router.patch("/email-edit", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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

    res.status(200).json({ message: "新しいメールアドレスにメールを送信しました。メールアドレスの変更はまだ完了しておりません。" });
  } catch (err) {
    next(err);
  }
});

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

router.post("/check-token", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  res.status(200).json({
    valid: true,
    userId: req.user!.id,
  });
});

router.get('/check-cookies', (req: Request, res: Response, next: NextFunction): void => {
  res.json(req.cookies);
});

router.get('/status', authenticateToken, (req: Request, res: Response, next: NextFunction) => {
  res.json({ loggedIn: true, user: req.user });
});

export default router;