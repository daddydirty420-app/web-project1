import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../middleware/index.js";
import { validateBody } from "../middleware/validateBody.js";
import { validateParams } from "../middleware/validateParams.js";
import { Address, ComOrFreeOption, Name, ShopInfoEdit, TodouhukenOption } from "../models/index.js";
import { createAddressShopEditUseCase } from "../usecases/shopInfoEdit/create/createAddress.js";
import { createBankAccountUseCase } from "../usecases/shopInfoEdit/create/createBankAccount.js";
import { createShopEditComFreeUseCase } from "../usecases/shopInfoEdit/create/createComFree.js";
import { createCompanyNameUseCase } from "../usecases/shopInfoEdit/create/createCompanyName.js";
import { createRepNameUseCase } from "../usecases/shopInfoEdit/create/createRepName.js";
import { getAddressShopEditUseCase } from "../usecases/shopInfoEdit/get/getAddress.js";
import { getBankAccountShopEditUseCase } from "../usecases/shopInfoEdit/get/getBankAccount.js";
import { getShopComFreeConfirmUseCase } from "../usecases/shopInfoEdit/get/getComFreeConfirm.js";
import { getConNameEditUseCase } from "../usecases/shopInfoEdit/get/getConName.js";
import { getRepNameEditUseCase } from "../usecases/shopInfoEdit/get/getRepName.js";
import { updateShopEditAnyUseCase } from "../usecases/shopInfoEdit/update/updateAny.js";
import { updateShopEditIdImageUseCase } from "../usecases/shopInfoEdit/update/updateIdImage.js";
import { AddressBody, addressBodySchema } from "../validators/body/address.js";
import { BankBody, bankBodySchema } from "../validators/body/bankAccount.js";
import { idParamSchema } from "../validators/params/id.js";
import { ComFreeIdBody, comFreeIdBodySchema, CreateCompanyNameBody, createCompanyNameBodySchema } from "../validators/body/shopInfoEdit.js";
import { RepNameBody, repNameBodySchema, ShopIdCardBody, shopIdCardBodySchema } from "../validators/body/shopInfo.js";

const router = Router();

// POST /shop-info-edit/:id/address
// summary: 会社所在地変更リクエスト
// page: /edit/address/shop/[id]
router.post(
    "/:id/address",
    validateParams(idParamSchema),
    validateBody(addressBodySchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        const body = req.validatedBody as AddressBody;

        try {
            await createAddressShopEditUseCase({
                shopId,
                userId,
                body,
            });

            res.status(200).json({ message: "住所の変更を受け付けました。" });
        } catch (err) {
            next(err);
        }
    },
);

// POST /shop-info-edit/:id/bank-account
// summary: 口座情報変更リクエスト
// page: /edit/account/shop/[id]
router.post(
    "/:id/bank-account",
    validateParams(idParamSchema),
    validateBody(bankBodySchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        const body = req.validatedBody as BankBody;

        try {
            await createBankAccountUseCase({
                userId,
                shopId,
                body,
            });

            res.status(200).json({ message: "口座情報の変更を受け付けました。" });
        } catch (err) {
            next(err);
        }
    },
);

// POST /shop-info-edit/:id/rep-name
// summary: 代表者氏名データ作成
// page: /edit/name/shop/rep-name/[id]
router.post(
    "/:id/rep-name",
    validateParams(idParamSchema),
    validateBody(repNameBodySchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;
        const body = req.validatedBody as RepNameBody;

        try {
            const { frontSignedUrl, rearSignedUrl } = await createRepNameUseCase({ shopId, userId, body });

            res.status(200).json({ frontSignedUrl, rearSignedUrl });
        } catch (err) {
            next(err);
        }
    },
);

// POST /shop-info-edit/:id/company-name
// summary: 会社名変更リクエスト
// page: /edit/shop/company-name/[id]
router.post(
    "/:id/company-name",
    validateParams(idParamSchema),
    validateBody(createCompanyNameBodySchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        const body = req.validatedBody as CreateCompanyNameBody;
        const companyName = body.companyName;

        try {
            await createCompanyNameUseCase({ shopId, userId, companyName });

            res.status(200).json({ message: "会社名の変更を受け付けました。" });
        } catch (err) {
            next(err);
        }
    },
);

// POST /shop-info-edit/:id/com-free
// summary: 事業形態変更リクエスト
// page: /edit/shop/com-free/[id]
router.post(
    "/:id/com-free",
    validateParams(idParamSchema),
    validateBody(comFreeIdBodySchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        const body = req.validatedBody as ComFreeIdBody;
        const comFreeId = body.selectOption;

        try {
            const editId = await createShopEditComFreeUseCase({ shopId, userId, comFreeId });

            res.status(200).json({ editId });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /shop-info-edit/:id
// summary: 事業形態変更確認ページ　データ更新
// page: /edit/shop/com-free/confirm/[id]
router.patch(
    "/:id",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopEditId = Number(req.params.id);
        const userId = req.user!.id;
        const updateData = req.body;

        try {
            await updateShopEditAnyUseCase({ shopEditId, userId, updateData });

            res.status(200).json({ message: "更新しました" });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /shop-info-edit/:id/id-image-upload
// summary: 事業者登録　代表者身分証アップロード
// page: edit/shop/com-free/upload/[id]
router.patch(
    "/:id/id-image-upload",
    validateParams(idParamSchema),
    validateBody(shopIdCardBodySchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopEditId = Number(req.params.id);
        const userId = req.user!.id;
        const body = req.validatedBody as ShopIdCardBody;

        try {
            const { frontSignedUrl, rearSignedUrl, permitSignedUrls } = await updateShopEditIdImageUseCase({
                shopEditId,
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

// GET /shop-info-edit/:id/address
router.get(
    "/:id/address",
    validateParams(idParamSchema),
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

// GET /shop-info-edit/:id/bank-account
router.get(
    "/:id/bank-account",
    validateParams(idParamSchema),
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

// GET /shop-info-edit/:id/rep-name
router.get(
    "/:id/rep-name",
    validateParams(idParamSchema),
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

// GET /shop-info-edit/:id/con-name
router.get(
    "/:id/con-name",
    validateParams(idParamSchema),
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

// GET /shop-info-edit/:id/com-free-confirm
router.get(
    "/:id/com-free-confirm",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const shopEditId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            const shopEdit = await getShopComFreeConfirmUseCase({ shopEditId, userId });

            res.status(200).json({ shopEdit });
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
