import bcrypt from "bcrypt";
import { AppError } from "../../errors.js";
import { updatePasswordUser } from "../../services/users/command.js";
import { getUserEmailOne } from "../../services/users/query.js";

type Params = {
    email: string;
    plainPassword: string;
};

export const rehashPasswordUseCase = async ({ email, plainPassword }: Params) => {
    // user取得
    const user = await getUserEmailOne({ email });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    // パスワードハッシュ
    const hashed = await bcrypt.hash(plainPassword, 10);

    // db更新
    await updatePasswordUser({
        user,
        data: {
            password: hashed,
        },
    });
};
