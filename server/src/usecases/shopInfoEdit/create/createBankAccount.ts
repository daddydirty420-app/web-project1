import sequelize from "../../../db.js";
import { AppError } from "../../../errors.js";
import { getAccountTypeOne } from "../../../services/accountTypeOption.js";
import { createBankAccountShopEdit } from "../../../services/bankAccount.js";
import { getBankOne } from "../../../services/banks.js";
import { getBranchOne } from "../../../services/branches.js";
import { createNotification } from "../../../services/notification.js";
import { getShop } from "../../../services/shopInfo/query.js";
import { createShopEdit } from "../../../services/shopInfoEdit/command.js";

type Params = {
    shopId: number;
    userId: number;
    bankName: string;
    branch: string;
    accountType: string;
    accountNumber: string;
    meigi: string;
};

export const createBankAccountUseCase = async ({
    shopId,
    userId,
    bankName,
    branch,
    accountType,
    accountNumber,
    meigi,
}: Params) => {
    // shopInfo取得
    const shop = await getShop({ shopId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    // 銀行名照合
    const matchedBank = await getBankOne({ bankName });

    if (!matchedBank) throw new AppError("INVALID_BANK", 400);

    // 支店名照合
    const matchedBranch = await getBranchOne({ bankCode: matchedBank.code, branch });

    if (!matchedBranch) throw new AppError("INVALID_BRANCH", 400);

    // 口座種別照合
    const accountTypeData = await getAccountTypeOne({ accountType });

    if (!accountTypeData) throw new AppError("INVALID_ACCOUNT_TYPE", 400);

    // db登録
    await sequelize.transaction(async (t) => {
        const shopEdit = await createShopEdit({
            data: {
                user_id: userId,
                shop_info_id: shopId,
            },
            transaction: t,
        });

        await createBankAccountShopEdit({
            data: {
                bank_code: matchedBank.code,
                bank_name: matchedBank.normalize?.name || matchedBank.name,
                branch_code: matchedBranch.code,
                branch: matchedBranch.normalize?.name || matchedBranch.name,
                account_type_id: accountTypeData.id,
                account_number: accountNumber,
                meigi: meigi,
                shop_info_edit_id: shopEdit.id,
            },
            transaction: t,
        });
    });

    // お知らせ作成
    createNotification({
        data: {
            read_user_id: userId,
            message:
                "口座情報の変更を受け付けました。審査には1~2週間程度お時間を要する場合がございます。審査完了までしばらくお待ちください。",
        },
    }).catch((err) => {
        console.error("service createNotification error:", err);
    });
};
