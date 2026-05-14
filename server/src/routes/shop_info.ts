import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { createShopStep1RateLimit } from "../middleware/rateLimit/shopInfoRateLimit.js";
import { validateBody } from "../middleware/validate/validateBody.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import { Address, ComOrFreeOption, Name, ShopInfo, TodouhukenOption } from "../models/index.js";
import { createShopSignup1 } from "../usecases/shopInfo/create/signup1.js";
import { editShopOptionUseCase } from "../usecases/shopInfo/edit/option.js";
import { editShopPhoneNumberUseCase } from "../usecases/shopInfo/edit/phoneNumber.js";
import { updateRepNameUseCase } from "../usecases/shopInfo/edit/repName.js";
import { updateShopSignup3UseCase } from "../usecases/shopInfo/edit/signup3.js";
import { updateShopSignup4UseCase } from "../usecases/shopInfo/edit/signup4.js";
import { updateShopSignup5UseCase } from "../usecases/shopInfo/edit/signup5.js";
import { updateShopSignupEditUseCase } from "../usecases/shopInfo/edit/signupEdit.js";
import { getAddressShopUseCase } from "../usecases/shopInfo/get/getAddress.js";
import { getBankAccountUseCase } from "../usecases/shopInfo/get/getBankAccount.js";
import { getShopComFreeUseCase } from "../usecases/shopInfo/get/getComFree.js";
import { getCompanyNameUseCase } from "../usecases/shopInfo/get/getCompanyName.js";
import { getConNameUseCase } from "../usecases/shopInfo/get/getConName.js";
import { getShopOptionUseCase } from "../usecases/shopInfo/get/getOption.js";
import { getShopPhoneNumberUseCase } from "../usecases/shopInfo/get/getPhoneNumber.js";
import { getRepNameUseCase } from "../usecases/shopInfo/get/getRepName.js";
import { getShopSignup1UseCase } from "../usecases/shopInfo/get/signup1.js";
import { getShopSignup2UseCase } from "../usecases/shopInfo/get/signup2.js";
import { getShopSignup3UseCase } from "../usecases/shopInfo/get/signup3.js";
import { getShopSignup5UseCase } from "../usecases/shopInfo/get/signup5.js";
import {
    createSignup1BBodySchema,
    CreateSignup1Body,
    RepNameBody,
    repNameBodySchema,
    ShopIdCardBody,
    shopIdCardBodySchema,
    ShopOptionBody,
    shopOptionBodySchema,
} from "../validators/body/shopInfo.js";
import { PhoneNumberBody, phoneNumberBodySchema } from "../validators/body/users.js";
import { idParamSchema } from "../validators/params/id.js";

const router = Router();

// POST /shop-info
// summary: ShopInfo作成　事業者登録
// page: /shop-signup/step1
router.post(
    "/",
    authenticateToken,
    createShopStep1RateLimit,
    validateBody(createSignup1BBodySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;
        const body = req.validatedBody as CreateSignup1Body;

        try {
            const shopId = await createShopSignup1({ userId, body });

            res.status(200).json({ shopId });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /shop-info/:id/rep-name
// summary 代表者氏名変更
// page: /edit/name/shop/rep-name/signup/[id]
router.patch(
    "/:id/rep-name",
    authenticateToken,
    validateParams(idParamSchema),
    validateBody(repNameBodySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;
        const body = req.validatedBody as RepNameBody;

        try {
            const { frontSignedUrl, rearSignedUrl } = await updateRepNameUseCase({ shopId, userId, body });

            res.status(200).json({ frontSignedUrl, rearSignedUrl });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /shop-info/:id/phone-number
// summary: 電話番号変更
// page: /edit/phone-number/shop/[id]
router.patch(
    "/:id/phone-number",
    authenticateToken,
    validateParams(idParamSchema),
    validateBody(phoneNumberBodySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        const body = req.validatedBody as PhoneNumberBody;
        const phoneNumber = body.phoneNumber;

        try {
            await editShopPhoneNumberUseCase({ shopId, userId, phoneNumber });

            res.status(200).json({ message: "電話番号を更新しました。" });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /shop-info/:id/option
// summary: オプション変更
// page: /edit/shop/option/[id]
router.patch(
    "/:id/option",
    authenticateToken,
    validateParams(idParamSchema),
    validateBody(shopOptionBodySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        const body = req.validatedBody as ShopOptionBody;
        const { autoTrans, openInfo } = body;

        try {
            await editShopOptionUseCase({ shopId, userId, autoTrans, openInfo });

            res.status(200).json({ message: "オプションを更新しました。" });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /shop-info/:id/signup/3
// summary: ショップ登録身分証・許認可証追加
// page: /shop-signup/step3/[id]
router.patch(
    "/:id/signup/3",
    authenticateToken,
    validateParams(idParamSchema),
    validateBody(shopIdCardBodySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;
        const body = req.validatedBody as ShopIdCardBody;

        try {
            const { frontSignedUrl, rearSignedUrl, permitSignedUrls } = await updateShopSignup3UseCase({
                shopId,
                userId,
                body,
            });

            res.status(200).json({
                message: "身分証・許認可証のDB登録が完了しました。",
                frontSignedUrl,
                rearSignedUrl,
                permitSignedUrls,
            });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /shop-info/:id/signup/4
// summary: ショップ登録オプション選択
// page: /shop-signup/step4/[id]
router.patch(
    "/:id/signup/4",
    authenticateToken,
    validateParams(idParamSchema),
    validateBody(shopOptionBodySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        const body = req.validatedBody as ShopOptionBody;
        const { autoTrans, openInfo } = body;

        try {
            await updateShopSignup4UseCase({ shopId, userId, autoTrans, openInfo });

            res.status(200).json({ message: "データ更新完了" });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /shop-info/:id/signup/edit
// summary: ショップ登録確認ページ　インプット編集
// page: /shop-signup/step5/[id]
router.patch(
    "/:id/signup/edit",
    authenticateToken,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;
        const updateData = req.body;

        try {
            await updateShopSignupEditUseCase({ shopId, userId, updateData });

            res.status(200).json({ message: "更新しました。", updated: updateData });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /shop-info/:id/signup/5
// summary: ショップ登録　確定
// page: /shop-signup/step5/[id]
router.patch(
    "/:id/signup/5",
    authenticateToken,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            await updateShopSignup5UseCase({ shopId, userId });

            res.status(200).json({ message: "ショップ登録のリクエストが完了しました！" });
        } catch (err) {
            next(err);
        }
    },
);

// GET /shop-info/:id/address
router.get(
    "/:id/address",
    authenticateToken,
    validateParams(idParamSchema),
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

// GET /shop-info/:id/bank-account
router.get(
    "/:id/bank-account",
    authenticateToken,
    validateParams(idParamSchema),
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

// GET /shop-info/:id/rep-name
router.get(
    "/:id/rep-name",
    authenticateToken,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            const { shop, name } = await getRepNameUseCase({ shopId, userId });

            res.status(200).json({ shop, name });
        } catch (err) {
            next(err);
        }
    },
);

// GET /shop-info/:id/con-name
router.get(
    "/:id/con-name",
    authenticateToken,
    validateParams(idParamSchema),
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

// GET /shop-info/:id/phone-number
router.get(
    "/:id/phone-number",
    authenticateToken,
    validateParams(idParamSchema),
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

// GET /shop-info/:id/company-name
router.get(
    "/:id/company-name",
    authenticateToken,
    validateParams(idParamSchema),
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

// GET /shop-info/:id/option
router.get(
    "/:id/option",
    authenticateToken,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            const shop = await getShopOptionUseCase({ shopId, userId });

            res.status(200).json({ shop });
        } catch (err) {
            next(err);
        }
    },
);

// GET /shop-info/:id/com-free
router.get(
    "/:id/com-free",
    authenticateToken,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            const { shop, comFree } = await getShopComFreeUseCase({ shopId, userId });

            res.status(200).json({ shop, comFree });
        } catch (err) {
            next(err);
        }
    },
);

// GET /shop-info/signup/1
// summary: 事業者情報登録ページ　インプット表示データ取得
// page: /shop-signup/step1
router.get("/signup/1", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;

    try {
        const { shop, user, comFree } = await getShopSignup1UseCase({ userId });

        res.status(200).json({ shop, user, comFree });
    } catch (err) {
        next(err);
    }
});

// GET /shop-info/:id/signup/2
// summary: ショップ口座登録ページ　インプット表示データ取得
// page: /shop-signup/step2/[id]
router.get(
    "/:id/signup/2",
    authenticateToken,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;
        const shopId = Number(req.params.id);

        try {
            const account = await getShopSignup2UseCase({ userId, shopId });

            res.status(200).json({ account });
        } catch (err) {
            next(err);
        }
    },
);

// GET /shop-info/:id/signup/3
// summary: ショップ身分証登録ページ　インプット表示データ取得
// page: /shop-signup/step3/[id]
router.get(
    "/:id/signup/3",
    authenticateToken,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;
        const shopId = Number(req.params.id);

        try {
            const shop = await getShopSignup3UseCase({ shopId, userId });

            res.status(200).json({ shop });
        } catch (err) {
            next(err);
        }
    },
);

// GET /shop-info/:id/signup/5
// summary: ショップ登録確認ページデータ取得
// page: /shop-signup/step5/[id]
router.get(
    "/:id/signup/5",
    authenticateToken,
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;
        const shopId = Number(req.params.id);

        try {
            const shop = await getShopSignup5UseCase({ shopId, userId });

            res.status(200).json({ shop });
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
    validateParams(idParamSchema),
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
    validateParams(idParamSchema),
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

router.get(
    "/infopage/:id",
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    },
);

router.get(
    "/open-info-request/:id",
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    },
);

export default router;
