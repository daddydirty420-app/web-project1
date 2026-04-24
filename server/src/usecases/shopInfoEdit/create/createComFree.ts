import sequelize from "../../../db.js";
import { AppError } from "../../../errors.js";
import { createAddressShopEditAllowNull } from "../../../services/address.js";
import { createBankAccountShopEditAllowNull } from "../../../services/bankAccount.js";
import { createNameShopEditAllowNull } from "../../../services/name.js";
import { getShopHasAddressNameBank } from "../../../services/shopInfo/query.js";
import { createShopEditComFree } from "../../../services/shopInfoEdit/command.js";

type Params = {
    shopId: number;
    userId: number;
    comFreeId: number;
};

export const createShopEditComFreeUseCase = async ({ shopId, userId, comFreeId }: Params) => {
    // shopInfo取得
    const shop = await getShopHasAddressNameBank({ shopId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);
    if (comFreeId === Number(shop.com_or_free_id)) {
        throw new AppError("INVALID_COM_FREE_ID", 400, "事業形態が変更されていません");
    }

    const address = shop.Address;
    const repName = shop.RepresentativeName;
    const conName = shop.ContactName;
    const bank = shop.BankAccount;

    // db作成
    const editId = await sequelize.transaction(async (t) => {
        const newRepName = await createNameShopEditAllowNull({
            data: {
                sei: repName?.sei ?? null,
                mei: repName?.mei ?? null,
                sei_kana: repName?.sei_kana ?? null,
                mei_kana: repName?.mei_kana ?? null,
                shop_type: "representative",
            },
            transaction: t,
        });

        const newConName = await createNameShopEditAllowNull({
            data: {
                sei: conName?.sei ?? null,
                mei: conName?.mei ?? null,
                sei_kana: conName?.sei_kana ?? null,
                mei_kana: conName?.mei_kana ?? null,
                shop_type: "contact",
            },
            transaction: t,
        });

        const shopEdit = await createShopEditComFree({
            data: {
                company_name: shop.company_name,
                phone_number: shop.phone_number,
                email: shop.email,
                open_date_time: shop.open_date_time,
                founded_date: shop.founded_date,
                member_count: shop.member_count,
                homepage_url: shop.homepage_url,
                company_number: shop.company_number,
                capital: shop.capital,
                user_id: userId,
                shop_info_id: shopId,
                com_or_free_id: comFreeId,
                name_representative_id: newRepName.id,
                name_contact_id: newConName.id,
            },
            transaction: t,
        });

        await createAddressShopEditAllowNull({
            data: {
                post_number: address?.post_number ?? null,
                todouhuken_id: address?.todouhuken_id ?? null,
                shikutyouson: address?.shikutyouson ?? null,
                banchi: address?.banchi ?? null,
                building: address?.building ?? null,
                shop_info_edit_id: shopEdit.id,
            },
            transaction: t,
        });

        await createBankAccountShopEditAllowNull({
            data: {
                bank_name: bank?.bank_name ?? null,
                bank_code: bank?.bank_code ?? null,
                branch: bank?.branch ?? null,
                branch_code: bank?.branch_code ?? null,
                account_type_id: bank?.account_type_id ?? null,
                account_number: bank?.account_number ?? null,
                meigi: bank?.meigi ?? null,
                shop_info_edit_id: shopEdit.id,
            },
            transaction: t,
        });

        return shopEdit.id;
    });

    return editId;
};
