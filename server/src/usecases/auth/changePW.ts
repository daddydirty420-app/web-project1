import bcrypt from "bcrypt";
import { AppError } from "../../errors.js";
import { updatePasswordUser } from "../../services/users/command.js";
import { getUser } from "../../services/users/query.js";

type Params = {
    userId: number;
    currentPw: string;
    newPw: string;
};

// PATCH /auth/change-pw
// summary: パスワード変更
// page: /edit/password
export const changePwUseCase = async ({ userId, currentPw, newPw }: Params) => {
    // ユーザー取得
    const user = await getUser({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    // 現在のパスワード照合
    const isMatch = await bcrypt.compare(currentPw, user.password);

    if (!isMatch) throw new AppError("NOT_SAME_CURRENT_PASSWORD", 400);

    // パスワードバリデーションチェック
    const regex = /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/;

    if (!regex.test(newPw)) throw new AppError("INVALID_PASSWORD", 400);

    // パスワードハッシュ化
    const hashedPassword = await bcrypt.hash(newPw, 10);

    // パスワード更新
    await updatePasswordUser({
        user,
        data: {
            password: hashedPassword,
        },
    });
};
