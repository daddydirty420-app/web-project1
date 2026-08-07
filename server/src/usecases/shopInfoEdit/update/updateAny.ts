import { AppError } from "../../../errors.js";
import { updateShopEditAny } from "../../../services/shopInfoEdit/command.js";
import { getMyShopEdit } from "../../../services/shopInfoEdit/query.js";
import type { ShopInfoEditUpdateData } from "../../../types/serviceType/shopInfoEdit.js";
import type { ShopInfoEditUpdateBody } from "../../../validators/body/shopInfoEdit.js";

type Params = {
    shopEditId: number;
    userId: number;
    updateData: ShopInfoEditUpdateBody;
};

const buildUpdateData = (updateData: ShopInfoEditUpdateBody): ShopInfoEditUpdateData => {
    if ("company_name" in updateData) return { company_name: updateData.company_name };
    if ("phone_number" in updateData) return { phone_number: updateData.phone_number };
    if ("email" in updateData) return { email: updateData.email };
    if ("open_date_time" in updateData) return { open_date_time: updateData.open_date_time };
    if ("founded_date" in updateData) return { founded_date: new Date(updateData.founded_date) };
    if ("member_count" in updateData) return { member_count: Number(updateData.member_count) };
    if ("homepage_url" in updateData) return { homepage_url: updateData.homepage_url };
    if ("company_number" in updateData) return { company_number: updateData.company_number };

    return { capital: Number(updateData.capital) };
};

// PATCH /shop-info-edit/:id
// summary: 事業形態変更確認ページ データ更新
// page: /edit/shop/com-free/confirm/[id]
export const updateShopEditAnyUseCase = async ({ shopEditId, userId, updateData }: Params) => {
    // shopEdit取得
    const shopEdit = await getMyShopEdit({ shopEditId, userId });

    if (!shopEdit) throw new AppError("SHOP_NOT_FOUND", 404);

    const data = buildUpdateData(updateData);

    // db更新
    await updateShopEditAny({
        shopEdit,
        data,
    });
};
