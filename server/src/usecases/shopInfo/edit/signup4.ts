import { AppError } from "../../../errors.js";
import { updateShopOption } from "../../../services/shopInfo/command.js";
import { getMyShop } from "../../../services/shopInfo/query.js";

type Params = {
    shopId: number;
    userId: number;
    autoTrans: boolean;
    openInfo: boolean;
};

// PATCH /shop-info/:id/signup/4
// summary: ショップ登録オプション選択
// page: /shop-signup/step4/[id]
export const updateShopSignup4UseCase = async ({ shopId, userId, autoTrans, openInfo }: Params) => {
    // shop取得
    const shop = await getMyShop({ shopId, userId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);

    // db更新
    await updateShopOption({
        shopInfo: shop,
        data: {
            auto_trans: autoTrans,
            open_info: openInfo,
        },
    });
};
