import { AppError } from '../../errors.js';
import { createTokenResetPW } from '../../services/tokenPasswordReset.js';
import { getUserEmailOne } from '../../services/users.js';
import crypto from 'crypto';

type Params = {
    email: string;
};

export const requestPasswordResetUseCase = async ({ email }: Params) => {
    // ユーザー取得
    const user = await getUserEmailOne({ email });

    if (!user) throw new AppError('USER_NOT_FOUND', 404);

    // pwリセットトークン発行
    const newResetToken = crypto.randomBytes(20).toString('hex');
    const newResetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    // DB登録
    await createTokenResetPW({
        data: {
            token_hash: newResetToken,
            expires_at: newResetTokenExpires,
            user_id: user.id,
        },
    });

    const resetUrl = `${process.env.CLIENT_URL}/login/new-pw/${newResetToken}`;

    // メール送信処理
};
