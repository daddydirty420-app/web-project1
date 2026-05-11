import { AppError } from "../../../errors.js";
import { updatePhoneNumberUser } from "../../../services/users/command.js";
import { getUser } from "../../../services/users/query.js";

type Params = {
    userId: number;
    phoneNumber: string;
};

// PATCH /user/phone-number
// summary: 電話番号変更
// page: /edit/phone-number
export const editPhoneNumber = async ({ userId, phoneNumber }: Params) => {
    // user取得
    const user = await getUser({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    // db更新
    await updatePhoneNumberUser({
        user,
        data: { phone_number: phoneNumber },
    });
};
