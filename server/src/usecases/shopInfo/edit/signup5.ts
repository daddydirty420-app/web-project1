import sequelize from "../../../db.js";
import { AppError } from "../../../errors.js";
import { Address, BankAccount, Name, ShopInfo } from "../../../models/index.js";
import { deleteAddress } from "../../../services/address.js";
import { deleteBankAccount } from "../../../services/bankAccount.js";
import { deleteName } from "../../../services/name.js";
import { deleteShop, updateShopRequestAll } from "../../../services/shopInfo/command.js";
import { getMyShop, getOldShopAll } from "../../../services/shopInfo/query.js";

type OldShop = {
    ShopInfo: InstanceType<typeof ShopInfo> & {
        Address?: InstanceType<typeof Address> | null;
        RepresentativeName?: InstanceType<typeof Name> | null;
        ContactName?: InstanceType<typeof Name> | null;
        BankAccount?: InstanceType<typeof BankAccount> | null;
    };
};

type Params = {
    shopId: number;
    userId: number;
};

// PATCH /shop-info/:id/signup/5
// summary: ショップ登録 確定
// page: /shop-signup/step5/[id]
export const updateShopSignup5UseCase = async ({ shopId, userId }: Params) => {
    // shop取得
    const shop = await getMyShop({ shopId, userId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);

    // 既存承認待ちshop削除
    const oldShops: OldShop[] = await getOldShopAll({ userId, shopId });

    await sequelize.transaction(async (t) => {
        if (oldShops.length > 0) {
            await Promise.all(
                oldShops.map(async (oldShop: InstanceType<typeof ShopInfo>) => {
                    if (oldShop.Address) {
                        await deleteAddress({
                            address: oldShop.Address,
                            transaction: t,
                        });
                    }

                    if (oldShop.RepresentativeName) {
                        await deleteName({
                            name: oldShop.RepresentativeName,
                            transaction: t,
                        });
                    }

                    if (oldShop.ContactName) {
                        await deleteName({
                            name: oldShop.ContactName,
                            transaction: t,
                        });
                    }

                    if (oldShop.BankAccount) {
                        await deleteBankAccount({
                            account: oldShop.BankAccount,
                            transaction: t,
                        });
                    }

                    await deleteShop({
                        shopInfo: oldShop,
                        transaction: t,
                    });
                }),
            );
        }

        await updateShopRequestAll({
            shopInfo: shop,
            data: { request_all: true },
            transaction: t,
        });
    });

    // メール送信処理
};
