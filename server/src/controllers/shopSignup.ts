import type { NextFunction, Request, Response } from "express-serve-static-core";
import { createShopSignup1 } from "../usecases/shopSignup/signup1.js";
import { CreateSignup1Body } from "../validators/body/shopSignup.js";

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
