import { AppError } from "../../../errors.js";
import { updateShopOption } from "../../../services/shopInfo/command.js";
import { getShop } from "../../../services/shopInfo/query.js";

type Params = {
    shopId: number;
    userId: number;
    autoTrans: boolean;
    openInfo: boolean;
};

export const editShopOptionUseCase = async ({ shopId, userId, autoTrans, openInfo }: Params) => {
    // ショップ取得
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
