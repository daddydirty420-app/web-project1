import { AppError } from "../../errors.js";
import { getAccountTypeOne } from "../../services/accountTypeOption.js";
import { upsertBankAccountShop } from "../../services/bankAccount.js";
import { getBankOne } from "../../services/banks.js";
import { getBranchOne } from "../../services/branches.js";
import { getShop } from "../../services/shopInfo/query.js";

type Body = {
    bankName: string;
    branch: string;
    accountType: string;
    accountNumber: string;
    meigi: string;
};

type Params = {
    shopId: number;
    userId: number;
    body: Body;
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

    // 空チェック
    const fields = { bankName, branch, accountType, accountNumber, meigi };
    const hasEmpty = Object.values(fields).some((v) => !v?.trim());
    if (hasEmpty) throw new AppError("INVALID_QUERY", 400);

    const bankNameTrim = bankName.trim();

    // 銀行名照合
    const matchedBank = await getBankOne({ bankName: bankNameTrim });

    if (!matchedBank) throw new AppError("INVALID_BANK", 400);

    // 支店名照合
    const matchedBranch = await getBranchOne({ bankCode: matchedBank.code, branch });

    if (!matchedBranch) throw new AppError("INVALID_BRANCH", 400);

    // 口座種別照合
    const accountTypeData = await getAccountTypeOne({ accountType });

    if (!accountTypeData) throw new AppError("INVALID_ACCOUNT_TYPE", 400);

    await upsertBankAccountShop({
        data: {
            shop_info_id: shopId,
            bank_code: matchedBank.code,
            bank_name: matchedBank.normalize?.name || matchedBank.name,
            branch_code: matchedBranch.code,
            branch: matchedBranch.normalize?.name || matchedBranch.name,
            account_type_id: accountTypeData.id,
            account_number: accountNumber,
            meigi: meigi,
        },
    });
};
