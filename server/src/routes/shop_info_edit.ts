import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { authenticateToken, isAdmin } from "../middleware/index.js";
import {
    Address,
    ComOrFreeOption,
    Name,
    Notification,
    ShopInfo,
    ShopInfoEdit,
    TodouhukenOption,
} from "../models/index.js";
import { createAddressShopEditUseCase } from "../usecases/shopInfoEdit/create/createAddress.js";
import { createBankAccountUseCase } from "../usecases/shopInfoEdit/create/createBankAccount.js";
import { createRepNameUseCase } from "../usecases/shopInfoEdit/create/createRepName.js";
import { getAddressShopEditUseCase } from "../usecases/shopInfoEdit/get/getAddress.js";
import { getBankAccountShopEditUseCase } from "../usecases/shopInfoEdit/get/getBankAccount.js";
import { getConNameEditUseCase } from "../usecases/shopInfoEdit/get/getConName.js";
import { getRepNameEditUseCase } from "../usecases/shopInfoEdit/get/getRepName.js";

const router = Router();

// POST /shop-info-edit/address/:id
router.post(
    "/address/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        // 空チェック
        const fields = {
            postNumber: req.body.postNumber,
            todouhuken: req.body.todouhuken,
            shikutyouson: req.body.shikutyouson,
            banchi: req.body.banchi,
        };

        const hasEmpty = Object.values(fields).some((v) => !v?.trim());

        if (hasEmpty) throw new AppError("INVALID_QUERY", 400);

        const postNumber = req.body.postNumber.trim();
        const todouhuken = req.body.todouhuken.trim();
        const shikutyouson = req.body.shikutyouson.trim();
        const banchi = req.body.banchi.trim();
        const building = req.body.building?.trim();

        // 郵便番号正規化バリデーションチェック
        const normalizedPostNumber = postNumber.replace(/-/g, "");
        if (!/^[0-9]{7}$/.test(normalizedPostNumber)) {
            throw new AppError("INVALID_POST_NUMBER", 400);
        }

        try {
            await createAddressShopEditUseCase({
                shopId,
                userId,
                postNumber,
                todouhuken,
                shikutyouson,
                banchi,
                building,
            });

            res.status(200).json({ message: "住所の変更を受け付けました。" });
        } catch (err) {
            next(err);
        }
    },
);

// POST /shop-info-edit/bank-account/:id
router.post(
    "/bank-account/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        const { bankName, branch, accountType, accountNumber, meigi } = req.body;

        // 空チェック
        const fields = { bankName, branch, accountType, accountNumber, meigi };
        const hasEmpty = Object.values(fields).some((v) => !v?.trim());
        if (hasEmpty) throw new AppError("INVALID_QUERY", 400);

        const bankNameTrim = bankName.trim();
        const branchTrim = branch.trim();
        const accountNumberTrim = accountNumber.trim();

        try {
            await createBankAccountUseCase({
                userId,
                shopId,
                bankName: bankNameTrim,
                branch: branchTrim,
                accountType,
                accountNumber: accountNumberTrim,
                meigi,
            });

            res.status(200).json({ message: "口座情報の変更を受け付けました。" });
        } catch (err) {
            next(err);
        }
    },
);

// POST /shop-info/rep-name/:id
router.post(
    "/rep-name/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);

        const userId = req.user!.id;

        const body = req.body;

        try {
            await createRepNameUseCase({ shopId, userId, body });

            res.status(200).json({ message: "代表者氏名の変更を受け付けました。" });
        } catch (err) {
            next(err);
        }
    },
);

router.post(
    "/company-name-edit/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = req.params.id;
        const userId = req.user!.id;
        const companyName = req.body.companyName;

        try {
            const shop = await ShopInfo.findByPk(shopId);

            if (!shop) {
                res.status(404).json({ message: "ショップデータが見つかりません。" });
                return;
            }

            const comFreeId = shop.com_or_free_id;

            if (comFreeId === 1) {
                await ShopInfoEdit.create({
                    company_name: companyName,
                    user_id: userId,
                    shop_info_id: shopId,
                });

                await Notification.create({
                    read_user_id: userId,
                    message:
                        "会社名の変更を受け付けました。審査には1~2週間程度お時間を要する場合がございます。審査完了までしばらくお待ちください。",
                });
            } else if (comFreeId === 2) {
                await shop.update({
                    company_name: companyName,
                });
            }

            res.status(200).json({ message: "会社名の変更を受け付けました。" });
        } catch (err) {
            next(err);
        }
    },
);

router.patch(
    "/option-edit/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = req.params.id;
        const autoTrans = req.body.autoTrans === "はい";
        const openInfo = req.body.openInfo === "はい";

        try {
            const shop = await ShopInfo.findByPk(shopId);

            if (!shop) {
                res.status(404).json({ message: "ショップデータが見つかりません。" });
                return;
            }

            await shop.update({
                auto_trans: autoTrans,
                open_info: openInfo,
            });

            res.status(200).json({ message: "オプションを更新しました。" });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/company-name/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = req.params.id;

        try {
            const shop = await ShopInfo.findByPk(shopId, {
                attributes: ["id", "company_name", "com_or_free_id"],
                include: [{ model: ComOrFreeOption }],
            });

            if (!shop) {
                res.status(404).json({ message: "ショップデータが見つかりません。" });
                return;
            }

            res.status(200).json({ shop });
        } catch (err) {
            next(err);
        }
    },
);

router.get("/option/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const shopId = req.params.id;

    try {
        const shop = await ShopInfo.findByPk(shopId, {
            attributes: ["id", "auto_trans", "open_info"],
        });

        if (!shop) {
            res.status(404).json({ message: "ショップデータが見つかりません。" });
            return;
        }

        res.status(200).json({ shop });
    } catch (err) {
        next(err);
    }
});

// GET /shop-info-edit/address/:id
router.get(
    "/address/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopEditId = Number(req.params.id);

        const userId = req.user!.id;

        try {
            const data = await getAddressShopEditUseCase({ shopEditId, userId });

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    },
);

// GET /shop-info-edit/bank-account/:id
router.get(
    "/bank-account/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopEditId = Number(req.params.id);

        const userId = req.user!.id;

        try {
            const data = await getBankAccountShopEditUseCase({ shopEditId, userId });

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    },
);

// GET /shop-info-edit/rep-name/:id
router.get(
    "/rep-name/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopEditId = Number(req.params.id);

        const userId = req.user!.id;

        try {
            const name = await getRepNameEditUseCase({ shopEditId, userId });

            res.status(200).json({ name });
        } catch (err) {
            next(err);
        }
    },
);

// GET /shop-info-edit/con-name/:id
router.get(
    "/con-name/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopEditId = Number(req.params.id);

        const userId = req.user!.id;

        try {
            const name = await getConNameEditUseCase({ shopEditId, userId });

            res.status(200).json({ name });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/admin/list",
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const dataList = await ShopInfoEdit.findAll({
                order: [["createdAt", "ASC"]],
                include: [
                    { model: ComOrFreeOption },
                    {
                        model: Address,
                        attributes: ["id", "post_number", "shikutyouson", "banchi", "building"],
                        include: [
                            {
                                model: TodouhukenOption,
                                as: "AddressTodouhuken",
                            },
                        ],
                    },
                    {
                        model: Name,
                        attributes: ["id", "sei", "mei", "sei_kana", "mei_kana"],
                    },
                ],
            });

            res.json({ dataList });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
