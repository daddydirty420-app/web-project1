import sequelize from "../../db.js";
import { AppError } from "../../errors.js";
import { createAddress } from "../../services/address.js";
import { createBank } from "../../services/bankAccount.js";
import { createIdCard } from "../../services/idCard.js";
import { createName } from "../../services/name.js";
import { createRefreshToken } from "../../services/refreshTokens.js";
import { destroyToken, getTokenVerificationOne } from "../../services/tokenSignupVerificationCode.js";
import { emailVerifyUser, getUser } from "../../services/users.js";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwtHelper.js";

type Params = {
    verificationCode: string;
    rememberMe: boolean;
};

export const signupVerifyUseCase = async ({ verificationCode, rememberMe }: Params) => {
    // 認証コード照合
    const tokenRecord = await getTokenVerificationOne({ verificationCode });

    if (!tokenRecord) throw new AppError("TOKEN_NOT_FOUND", 404);
    if (new Date() > new Date(tokenRecord.reissue_token_expires)) {
        throw new AppError("EXPIRED_TOKEN", 410);
    }

    // user取得
    const user = await getUser({ userId: tokenRecord.user_id });

    if (!user) {
        destroyToken({ tokenRecord }).catch((err) => {
            console.error("service tokenSignuVerificationCode destroyToken error:", err);
        });

        throw new AppError("USER_NOT_FOUND", 404);
    }
    
    // アクセストークン発行
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user, rememberMe);

    const expiresAt = rememberMe
    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

    const userId = user.id;

    // db更新
    await sequelize.transaction(async (t) => {
        await emailVerifyUser({
            user,
            data: {
                email_verified: true,
            },
            transaction: t,
        });

        await createRefreshToken({
            data: {
                token: newRefreshToken,
                user_id: userId,
                expires_at: expiresAt,
            },
            transaction: t,
        });

        await createAddress({
            data: {
                user_id: userId,
            },
            transaction: t,
        });

        await createName({
            data: {
                user_id: userId,
            },
            transaction: t,
        });

        await createBank({
            data: {
                user_id: userId,
            },
            transaction: t,
        });

        await createIdCard({
            data: {
                user_id: userId,
            },
            transaction: t,
        });
    });

    destroyToken({ tokenRecord }).catch((err) => {
        console.error("service tokenSignuVerificationCode destroyToken error:", err);
    });

    return {
        id: userId,
        email: user.email,
        userName: user.user_name,
        admin: user.admin,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    };
};