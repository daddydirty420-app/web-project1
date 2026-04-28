import { AppError } from "../../../errors.js";
import { updateShopOption } from "../../../services/shopInfo/command.js";
import { getShop } from "../../../services/shopInfo/query.js";

type Params = {
    shopId: number;
    userId: number;
    autoTrans: boolean;
    openInfo: boolean;
};

// PATCH /shop-info/signup/4/:id
// summary: ショップ登録身分証・許認可証追加
// page: /shop-signup/step4/[id]
export const updateShopSignup4UseCase = async ({ shopId, userId, autoTrans, openInfo }: Params) => {
    // shop取得
    const shop = await getShop({ shopId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    // db更新
    await updateShopOption({
        shopInfo: shop,
        data: {
            auto_trans: autoTrans,
            open_info: openInfo,
        },
    });
};
