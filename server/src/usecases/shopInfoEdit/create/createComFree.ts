import sequelize from "../../../db.js";
import { AppError } from "../../../errors.js";
import { createAddressShopEdit } from "../../../services/address.js";
import { createBankAccountShopEdit } from "../../../services/bankAccount.js";
import { createNameShopEdit } from "../../../services/name.js";
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
            },
            transaction: t,
        });

        if (address) {
            await createAddressShopEdit({
                data: {
                    post_number: address.post_number,
                    todouhuken_id: address.todouhuken_id,
                    shikutyouson: address.shikutyouson,
                    banchi: address.banchi,
                    building: address.building,
                    shop_info_edit_id: shopEdit.id,
                },
                transaction: t,
            });
        }

        if (repName) {
            await createNameShopEdit({
                data: {
                    sei: repName.sei,
                    mei: repName.mei,
                    sei_kana: repName.sei_kana,
                    mei_kana: repName.mei_kana,
                    shop_info_edit_id: shopEdit.id,
                    shop_type: "representative",
                },
                transaction: t,
            });
        }

        if (conName) {
            await createNameShopEdit({
                data: {
                    sei: conName.sei,
                    mei: conName.mei,
                    sei_kana: conName.sei_kana,
                    mei_kana: conName.mei_kana,
                    shop_info_edit_id: shopEdit.id,
                    shop_type: "contact",
                },
                transaction: t,
            });
        }

        if (bank) {
            await createBankAccountShopEdit({
                data: {
                    bank_name: bank.bank_name,
                    bank_code: bank.bank_code,
                    branch: bank.branch,
                    branch_code: bank.branch_code,
                    account_type_id: bank.account_type_id,
                    account_number: bank.account_number,
                    meigi: bank.meigi,
                    shop_info_edit_id: shopEdit.id,
                },
                transaction: t,
            });
        }

        return shopEdit.id;
    });

    return editId;
};
