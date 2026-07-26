import sequelize from "../../db.js";
import { AppError } from "../../errors.js";
import { createBankAccount } from "../../services/bankAccount.js";
import { getBankOne } from "../../services/banks.js";
import { getBranchOne } from "../../services/branches.js";
import { updateShopBankAccount } from "../../services/shopInfo/command.js";
import { getShop } from "../../services/shopInfo/query.js";
import { BankBody } from "../../validators/body/bankAccount.js";

type Params = {
    shopId: number;
    userId: number;
    body: BankBody;
};

// POST /bank-account/:id/shop
// summary: ショップ口座情報作成
// page: /shop-signup/step2
export const createShopAccount = async ({ shopId, userId, body }: Params) => {
    // ショップ取得
    const shop = await getShop({ shopId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    // body
    const { bankName, branch, accountType, accountNumber, meigi } = body;

    // 銀行名照合
    const matchedBank = await getBankOne({ bankName });

    if (!matchedBank) throw new AppError("INVALID_BANK", 400);

    // 支店名照合
    const matchedBranch = await getBranchOne({ bankCode: matchedBank.code, branch });

    if (!matchedBranch) throw new AppError("INVALID_BRANCH", 400);

    // 口座情報作成
    await sequelize.transaction(async (t) => {
        const newAccount = await createBankAccount({
            data: {
                bank_code: matchedBank.code,
                bank_name: matchedBank.normalize?.name || matchedBank.name,
                branch_code: matchedBranch.code,
                branch: matchedBranch.normalize?.name || matchedBranch.name,
                account_number: accountNumber,
                meigi: meigi,
                account_type: accountType,
            },
            transaction: t,
        });

        await updateShopBankAccount({
            shopInfo: shop,
            data: {
                account_id: newAccount.id,
            },
            transaction: t,
        });
    });
};
