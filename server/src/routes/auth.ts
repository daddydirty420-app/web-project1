import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateAccessToken, generateRefreshToken, JwtUserPayload } from "../utils/jwtHelper.js";
import { authenticateToken } from "../middleware/index.js";
import { User, SignupVerificationTokens, PasswordResetTokens, EmailChangeTokens, RefreshTokens, Address, Name, BankAccount, IdCard } from "../models/index.js";
import sequelize from "../db.js";
import jwt from "jsonwebtoken";
import { Op } from "sequelize";

const router = Router();

export interface AuthUser {
  id: number;
  email: string;
  admin: boolean;
  iat?: number;
  exp?: number;
  iss?: string;
  sub?: string;
  aud?: string | string[];
  jti?: string;
}

interface DecodedAccessToken {
  id: number | string;
  email: string;
  type: "access";
  iat?: number;
  exp?: number;
}

router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { email, password, rememberMe } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "メールアドレスまたはパスワードがありません。" });
    return;
  }

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(401).json({ message: 'ユーザーが見つかりません。' });
      return;
    }

    const userId = user.id;

    if (!user.email_verified) {
      res.status(403).json({ message: 'このアカウントは有効ではありません。' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: 'パスワードが間違っています。' });
      return;
    }

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user, rememberMe);

    await RefreshTokens.destroy({ where: { user_id: userId } });

    await RefreshTokens.create({
      token: newRefreshToken,
      user_id: userId,
      expires_at: rememberMe
      ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      path: "/",
      domain: ".fuckintesting.com",
      maxAge: rememberMe
      ? 30 * 24 * 60 * 60 * 1000
      : 3 * 24 * 60 * 60 * 1000,
    });

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
    console.error(err);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
});

router.post("/set-cookie", async (req: Request, res: Response): Promise<void> => {
  const { refreshToken, rememberMe } = req.body;
  if (!refreshToken) {
    res.status(400).json({ message: "refreshToken がありません" });
    return;
  }

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    domain: ".fuckintesting.com",
    maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 3 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ message: "Cookie をセットしました" });
});

function generateRandomUserName(length: number = 12): string {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

router.post('/signup', async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).json({ message: 'すでにこのメールアドレスは登録されています。' });
            return;
        }

        const regex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!regex.test(password)) {
            res.status(400).json({ message: 'パスワードは8文字以上の半角英数字で、小文字と数字を含めてください。' });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user_name: string = generateRandomUserName();

        const newUser = await User.create({
            email,
            password: hashedPassword,
            user_name
        });

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

        const reissueToken = crypto.randomBytes(20).toString('hex');
        const reissueTokenExpires = new Date(Date.now() + 30 * 60 * 1000);

        await SignupVerificationTokens.create({
          user_id: newUser.id,
          verification_code: verificationCode,
          verification_code_expires: expiresAt,
          reissue_token: reissueToken,
          reissue_token_expires: reissueTokenExpires
        });

        const reissueUrl = `${process.env.CLIENT_URL}/signup/verify?token=${reissueToken}`

        // メール送信処理

        res.status(201).json({
          message: 'サインアップ成功！認証コードを送信しました！',
          expiresAt,
          reissueUrl
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.post('/resend-verification-code', async (req: Request, res: Response): Promise<void> => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ message: '再発行用のトークンがありません。' });
    return;
  }

  try {
    const tokenRecord = await SignupVerificationTokens.findOne({
      where: {
        reissue_token: token
      },
      include: [{ model: User }]
    });

    if (!tokenRecord || !tokenRecord.User) {
      res.status(404).json({ message: 'ユーザーが見つかりません。' });
      return;
    }

    if (new Date() > new Date(tokenRecord.reissue_token_expires)) {
      res.status(410).json({ message: 'トークンの有効期限が切れています。' });
      return;
    }

    const newVereficationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const newReissueToken = crypto.randomBytes(20).toString('hex');
    const newReissueTokenExpires = new Date(Date.now() + 30 * 60 * 1000);

    tokenRecord.verification_code = newVereficationCode;
    tokenRecord.verification_code_expires = newExpiresAt;
    tokenRecord.reissue_token = newReissueToken;
    tokenRecord.reissue_token_expires = newReissueTokenExpires;
    await tokenRecord.save();

    const reissueUrl = `${process.env.CLIENT_URL}/signup/verify?token=${newReissueToken}`;

    // メール送信処理

    res.status(200).json({
      message: '新しい認証コードを発行しました。',
      expiresAt: newExpiresAt,
      reissueUrl
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
});

router.post('/signup-verify', async (req: Request, res: Response): Promise<void> => {
  const { verificationCode, rememberMe } = req.body;

  const t = await sequelize.transaction();

  try {
    const tokenRecord = await SignupVerificationTokens.findOne({
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
    console.error(err);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
});

router.post('/request-password-reset', async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      res.status(200).json({ message: 'メールを送信しました。' });
      return;
    };

    const newResetToken = crypto.randomBytes(20).toString('hex');
    const newResetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    await PasswordResetTokens.create({
      token_hash: newResetToken,
      expires_at: newResetTokenExpires,
      user_id: user.id
    });

    const resetUrl = `${process.env.CLIENT_URL}/login/new-pw/${newResetToken}`;

    // メール送信処理

    res.status(200).json({ message: 'メールを送信しました。' });
  } catch (err) {
    console.error(err);
    res.status(200).json({ message: 'メールを送信しました。' });
  }
});

router.post('/reset-pw', async (req: Request, res: Response): Promise<void> => {
  const { token, password } = req.body;

  try {
    const resetRecord = await PasswordResetTokens.findOne({ where: { token_hash: token } });
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
    console.error(err);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
});

router.post("/refresh-token", async (req: Request, res: Response): Promise<void> => {
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
    console.error(err);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
});

router.get('/check-token', authenticateToken, (req: Request, res: Response): void => {
    res.json({ message: 'トークン有効', user: req.user });
});

router.post('/rehash-password', async (req: Request, res: Response): Promise<void> => {
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

router.patch("/email-edit", authenticateToken, async (req: Request, res: Response): Promise<void> => {
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

    await EmailChangeTokens.create({
      token_hash: token,
      expires_at: tokenExpires,
      user_id: userId,
      new_email: newEmail,
    });

    const url = `${process.env.CLIENT_URL}/edit/email/new-email/${token}`;

    // メール送信処理

    res.status(200).json({ message: "新しいメールアドレスにメールを送信しました。メールアドレスの変更はまだ完了しておりません。" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
});

router.patch("/new-email-change", async (req: Request, res: Response): Promise<void> => {
  const token = req.query.token;

  try {
    const emailTokenData = await EmailChangeTokens.findOne({
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

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404).json({ message: "ユーザーが見つかりません。" });
      return;
    }

    await user.update({ email: emailTokenData.new_email });

    res.status(200).json({ message: "メールアドレスを更新しました。" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーが発生しました。" });
  }
});

router.post("/check-token", authenticateToken, async (req: Request, res: Response): Promise<void> => {
  res.status(200).json({
    valid: true,
    userId: req.user!.id,
  });
});

router.get('/check-cookies', (req: Request, res: Response): void => {
  res.json(req.cookies);
});

router.get('/status', authenticateToken, (req: Request, res: Response) => {
  res.json({ loggedIn: true, user: req.user });
});

export default router;