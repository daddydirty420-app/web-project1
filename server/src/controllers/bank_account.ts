import type { NextFunction, Request, Response } from "express-serve-static-core";
import { createShopAccount } from "../usecases/bankAccount/createShop.js";
import { editAccountUseCase } from "../usecases/bankAccount/editAccount.js";
import { BankBody } from "../validators/body/bankAccount.js";

// POST /bank-account/:id/shop
// summary: ショップ口座情報作成
// page: /shop-signup/step2
export const bankAccountPostByIdShopController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const shopId = Number(req.params.id);
    const userId = req.user!.id;
    const body = req.validatedBody as BankBody;

    try {
        await createShopAccount({ shopId, userId, body });

        res.status(200).json({ message: "口座情報を登録しました。" });
    } catch (err) {
        next(err);
    }
};

// PATCH /bank-account/:id
// summary: 口座情報変更
// page: /edit/account
export const bankAccountPatchByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    const accountId = Number(req.params.id);
    const userId = req.user!.id;

    const body = req.validatedBody as BankBody;

    try {
        await editAccountUseCase({
            userId,
            accountId,
            body,
        });

        res.status(200).json({ message: "口座情報を更新しました。" });
    } catch (err) {
        next(err);
    }
};
