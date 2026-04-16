import { AppError } from "../../errors.js";
import { createUser, getUserEmailOne } from "../../services/users.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { generateRandomUserName } from "../../utils/generateRandomUserName";
import sequelize from "../../db.js";
import { createSignupToken } from "../../services/tokenSignupVerificationCode.js";

type Params = {
    email: string;
    password: string;
};

export const signupUseCase = async ({ email, password }: Params) => {
    // user取得
    const existingUser = await getUserEmailOne({ email });

    if (existingUser) throw new AppError("EXISTING_USER", 409);

    // パスワード　バリデーションチェック
    const regex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (!regex.test(password)) throw new AppError("INVALID_PASSWORD", 400);
    
    // パスワード　ハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザーネーム生成
    const userName: string = generateRandomUserName();

    // 認証コード作成
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
    
    const reissueToken = crypto.randomBytes(20).toString('hex');
    const reissueTokenExpires = new Date(Date.now() + 30 * 60 * 1000);

    await sequelize.transaction(async (t) => {
        // ユーザー作成
        const newUser = await createUser({
            data: {
                email,
                password: hashedPassword,
                user_name: userName,
            },
            transaction: t,
        });

        // 認証コードDB登録
        await createSignupToken({
            data: {
                user_id: newUser.id,
                verification_code: verificationCode,
                verification_code_expires: expiresAt,
                reissue_token: reissueToken,
                reissue_token_expires: reissueTokenExpires,
            },
            transaction: t,
        });
    });

    const reissueUrl = `${process.env.CLIENT_URL}/signup/verify?token=${reissueToken}`;

    // メール送信処理

    return { expiresAt, reissueUrl };
};