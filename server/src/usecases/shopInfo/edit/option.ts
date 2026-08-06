import { AppError } from "../../../errors.js";
import { updateShopOption } from "../../../services/shopInfo/command.js";
import { getMyShop } from "../../../services/shopInfo/query.js";

type Params = {
    shopId: number;
    userId: number;
    autoTrans: boolean;
    openInfo: boolean;
};

// PATCH /shop-info/:id/option
// summary: オプション変更
// page: /edit/shop/option/[id]
export const editShopOptionUseCase = async ({ shopId, userId, autoTrans, openInfo }: Params) => {
    // ショップ取得
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
