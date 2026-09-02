import type { NextFunction, Request, Response } from "express-serve-static-core";
import { createShopSignup1 } from "../usecases/shopSignup/signup1.js";
import { updateShopSignup2UseCase } from "../usecases/shopSignup/signup2.js";
import { updateShopSignup3UseCase } from "../usecases/shopSignup/signup3/signup3.js";
import { BankBody } from "../validators/body/bankAccount.js";
import { CreateSignup1Body, ShopSignup3Body } from "../validators/body/shopSignup.js";

// POST /shop-signup
// summary: ShopSignup作成 事業者登録
// page: /shop-signup/step1
export const shopSignupPostRootController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user!.id;
        const body = req.validatedBody as CreateSignup1Body;

        const shopId = await createShopSignup1({ userId, body });

        res.status(200).json({ shopId });
    } catch (err) {
        next(err);
    }
};

// PATCH /shop-signup/:id/bank-account
// summary: ショップ口座情報作成
// page: /shop-signup/step2
export const updateShopSignup2Controller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const shopSignupId = Number(req.params.id);
        const userId = req.user!.id;
        const body = req.validatedBody as BankBody;

        await updateShopSignup2UseCase({ shopSignupId, userId, body });

        res.status(200).json({ message: "口座情報を登録しました。" });
    } catch (err) {
        next(err);
    }
};

// PATCH /shop-signup/:id/id-card
// summary: ショップ登録身分証・許認可証追加
// page: /shop-signup/step3/[id]
export const updateShopSignup3Controller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const shopSignupId = Number(req.params.id);
        const userId = req.user!.id;
        const body = req.validatedBody as ShopSignup3Body;

        await updateShopSignup3UseCase({ shopSignupId, userId, body });

        res.status(200).json({ message: "身分証および営業許可証を登録しました。" });
    } catch (err) {
        next(err);
    }
};
