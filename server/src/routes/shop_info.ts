import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { authenticateToken } from "../middleware/index.js";
import { Address, ComOrFreeOption, Name, ShopInfo, TodouhukenOption } from "../models/index.js";
import { editShopOptionUseCase } from "../usecases/shopInfo/edit/option.js";
import { editShopPhoneNumberUseCase } from "../usecases/shopInfo/edit/phoneNumber.js";
import { updateRepNameUseCase } from "../usecases/shopInfo/edit/repName.js";
import { getAddressShopUseCase } from "../usecases/shopInfo/get/getAddress.js";
import { getBankAccountUseCase } from "../usecases/shopInfo/get/getBankAccount.js";
import { getCompanyNameUseCase } from "../usecases/shopInfo/get/getCompanyName.js";
import { getConNameUseCase } from "../usecases/shopInfo/get/getConName.js";
import { getShopOptionUseCase } from "../usecases/shopInfo/get/getOption.js";
import { getShopPhoneNumberUseCase } from "../usecases/shopInfo/get/getPhoneNumber.js";
import { getRepNameUseCase } from "../usecases/shopInfo/get/getRepName.js";

const router = Router();

// PATCH /shop-info/rep-name/:id
router.patch(
    "/rep-name/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;
        const body = req.body;

        try {
            await updateRepNameUseCase({ shopId, userId, body });

            res.status(200).json({ message: "代表者氏名を変更しました。" });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /shop-info/phone-number/:id
router.patch(
    "/phone-number/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;
        const phoneNumber = req.body.phoneNumber?.trim();

        if (!phoneNumber || !/^[0-9]+$/.test(phoneNumber)) {
            throw new AppError("INVALID_PHONE_NUMBER", 400);
        }

        try {
            await editShopPhoneNumberUseCase({ shopId, userId, phoneNumber });

            res.status(200).json({ message: "電話番号を更新しました。" });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /shop-info/option/:id
router.patch(
    "/option/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        const autoTrans = req.body.autoTrans === "はい";
        const openInfo = req.body.openInfo === "はい";

        try {
            await editShopOptionUseCase({ shopId, userId, autoTrans, openInfo });

            res.status(200).json({ message: "オプションを更新しました。" });
        } catch (err) {
            next(err);
        }
    },
);

router.get("/com-or-free", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await ComOrFreeOption.findAll();

        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
});

router.get(
    "/has-shop/me",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const currentUserId = req.user!.id;
        try {
            const hasShop = await ShopInfo.findOne({
                where: {
                    user_id: currentUserId,
                    verified: true,
                },
            });

            if (!hasShop) {
                res.status(200).json({ hasShop: false });
                return;
            }

            res.status(200).json({ hasShop: true });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/edit-form/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await ShopInfo.findByPk(req.params.id, {
                attributes: ["id"],
                include: [{ model: ComOrFreeOption }],
            });

            if (!data) {
                res.status(404).json({ message: "データが見つかりません。" });
                return;
            }

            const allOptions = await ComOrFreeOption.findAll();

            res.json({
                data: data,
                allOptions: allOptions,
            });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/edit-other/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await ShopInfo.findByPk(req.params.id, {
                attributes: [
                    "id",
                    "homepage_url",
                    "open_date_time",
                    "company_number",
                    "capital",
                    "member_count",
                    "founded_date",
                ],
            });

            if (!data) {
                res.status(404).json({ message: "データが見つかりません。" });
                return;
            }

            res.json(data);
        } catch (err) {
            next(err);
        }
    },
);

router.get("/infopage/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await ShopInfo.findByPk(req.params.id, {
            attributes: [
                "id",
                "company_name",
                "shop_name",
                "email",
                "phone_number",
                "homepage_url",
                "open_date_time",
                "open_info",
            ],
            include: [
                {
                    model: Address,
                    attributes: ["post_number", "shikutyouson", "banchi", "building"],
                    include: [
                        {
                            model: TodouhukenOption,
                            as: "AddressTodouhuken",
                        },
                    ],
                },
                {
                    model: Name,
                    attributes: ["sei", "mei", "sei_kana", "mei_kana"],
                },
            ],
        });

        if (!data) {
            res.status(404).json({ message: "データが見つかりません。" });
            return;
        }

        res.json({ data });
    } catch (err) {
        next(err);
    }
});

router.get("/open-info-request/:id", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = await ShopInfo.findByPk(req.params.id, {
            attributes: ["id", "shop_name"],
        });

        if (!data) {
            res.status(404).json({ message: "データが見つかりません。" });
            return;
        }

        res.json({ data });
    } catch (err) {
        next(err);
    }
});

// GET /shop-info/address/:id
router.get(
    "/address/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            const data = await getAddressShopUseCase({ shopId, userId });

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    },
);

// GET /shop-info/bank-account/:id
router.get(
    "/bank-account/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            const data = await getBankAccountUseCase({ shopId, userId });

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    },
);

// GET /shop-info/rep-name/:id
router.get(
    "/rep-name/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            const name = await getRepNameUseCase({ shopId, userId });

            res.status(200).json({ name });
        } catch (err) {
            next(err);
        }
    },
);

// GET /shop-info/con-name/:id
router.get(
    "/con-name/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            const name = await getConNameUseCase({ shopId, userId });

            res.status(200).json({ name });
        } catch (err) {
            next(err);
        }
    },
);

// GET /shop-info/phone-number
router.get(
    "/phone-number/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            const shop = await getShopPhoneNumberUseCase({ shopId, userId });

            res.status(200).json({ shop });
        } catch (err) {
            next(err);
        }
    },
);

// GET /shop-info/company-name/:id
router.get(
    "/company-name/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            const shop = await getCompanyNameUseCase({ shopId, userId });

            res.status(200).json({ shop });
        } catch (err) {
            next(err);
        }
    },
);

// GET /shop-info/option/:id
router.get("/option/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const shopId = Number(req.params.id);
    const userId = req.user!.id;

    try {
        const shop = await getShopOptionUseCase({ shopId, userId });

        res.status(200).json({ shop });
    } catch (err) {
        next(err);
    }
});

export default router;
