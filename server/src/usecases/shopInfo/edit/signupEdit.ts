import { AppError } from "../../../errors.js";
import { updateShopAny } from "../../../services/shopInfo/command.js";
import { getShop } from "../../../services/shopInfo/query.js";

type Params = {
    shopId: number;
    userId: number;
    updateData: any;
};

// PATCH /shop-info/signup/edit/:id
// summary: ショップ登録確認ページ　インプット編集
// page: /shop-signup/step5/[id]
export const updateShopSignupEditUseCase = async ({ shopId, userId, updateData }: Params) => {
    // shop取得
    const shop = await getShop({ shopId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    // db更新
    await updateShopAny({
        shopInfo: shop,
        data: updateData,
    });
};
