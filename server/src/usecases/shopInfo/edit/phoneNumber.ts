import sequelize from "../../../db.js";
import { AppError } from "../../../errors.js";
import { updateShopPhoneNumber } from "../../../services/shopInfo/command.js";
import { getShop } from "../../../services/shopInfo/query.js";
import { updatePhoneNumberUser } from "../../../services/users/command.js";
import { getUser } from "../../../services/users/query.js";

type Params = {
    shopId: number;
    userId: number;
    phoneNumber: string;
};

// PATCH /shop-info/:id/phone-number
// summary: 電話番号変更
// page: /edit/phone-number/shop/[id]
export const editShopPhoneNumberUseCase = async ({ shopId, userId, phoneNumber }: Params) => {
    // shopInfo取得
    const shop = await getShop({ shopId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    // user取得
    const user = await getUser({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    // db更新
    await sequelize.transaction(async (t) => {
        await updateShopPhoneNumber({
            shopInfo: shop,
            data: { phone_number: phoneNumber },
            transaction: t,
        });

        await updatePhoneNumberUser({
            user,
            data: { phone_number: phoneNumber },
            transaction: t,
        });
    });
};
