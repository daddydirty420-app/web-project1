import { AppError } from "../../../errors.js";
import { updateShopAny } from "../../../services/shopInfo/command.js";
import { getMyShop } from "../../../services/shopInfo/query.js";
import type { ShopInfoUpdateData } from "../../../types/serviceType/shopInfo.js";
import type { ShopSignupEditBody } from "../../../validators/body/shopInfo.js";

type Params = {
    shopId: number;
    userId: number;
    updateData: ShopSignupEditBody;
};

const buildUpdateData = (updateData: ShopSignupEditBody): ShopInfoUpdateData => {
    if ("com_or_free_id" in updateData) return { com_or_free_id: updateData.com_or_free_id };
    if ("company_name" in updateData) return { company_name: updateData.company_name };
    if ("shop_name" in updateData) return { shop_name: updateData.shop_name };
    if ("phone_number" in updateData) return { phone_number: updateData.phone_number };
    if ("email" in updateData) return { email: updateData.email };
    if ("open_date_time" in updateData) return { open_date_time: updateData.open_date_time };
    if ("founded_date" in updateData) return { founded_date: new Date(updateData.founded_date) };
    if ("member_count" in updateData) return { member_count: Number(updateData.member_count) };
    if ("homepage_url" in updateData) return { homepage_url: updateData.homepage_url };
    if ("company_number" in updateData) return { company_number: updateData.company_number };
    if ("capital" in updateData) return { capital: Number(updateData.capital) };
    if ("auto_trans" in updateData) return { auto_trans: updateData.auto_trans === "true" };

    return { open_info: updateData.open_info === "true" };
};

// PATCH /shop-info/:id/signup/edit
// summary: ショップ登録確認ページ インプット編集
// page: /shop-signup/step5/[id]
export const updateShopSignupEditUseCase = async ({ shopId, userId, updateData }: Params) => {
    // shop取得
    const shop = await getMyShop({ shopId, userId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);

    const data = buildUpdateData(updateData);

    // db更新
    await updateShopAny({
        shopInfo: shop,
        data,
    });
};
