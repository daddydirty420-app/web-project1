import type { NextFunction, Request, Response } from "express-serve-static-core";
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
import { AddressBody } from "../validators/body/address.js";
import { BankBody } from "../validators/body/bankAccount.js";
import { RepNameBody, ShopIdCardBody } from "../validators/body/shopInfo.js";
import { ComFreeIdBody, CreateCompanyNameBody } from "../validators/body/shopInfoEdit.js";

// POST /shop-info-edit/:id/address
// summary: 会社所在地変更リクエスト
// page: /edit/address/shop/[id]
export const shopInfoEditPostByIdAddressController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        const body = req.validatedBody as AddressBody;

        await createAddressShopEditUseCase({
            shopId,
            userId,
            body,
        });

        res.status(200).json({ message: "住所の変更を受け付けました。" });
    } catch (err) {
        next(err);
    }
};

// POST /shop-info-edit/:id/bank-account
// summary: 口座情報変更リクエスト
// page: /edit/account/shop/[id]
export const shopInfoEditPostByIdBankAccountController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        const body = req.validatedBody as BankBody;

        await createBankAccountUseCase({
            userId,
            shopId,
            body,
        });

        res.status(200).json({ message: "口座情報の変更を受け付けました。" });
    } catch (err) {
        next(err);
    }
};

// POST /shop-info-edit/:id/rep-name
// summary: 代表者氏名データ作成
// page: /edit/name/shop/rep-name/[id]
export const shopInfoEditPostByIdRepNameController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;
        const body = req.validatedBody as RepNameBody;

        const { frontSignedUrl, rearSignedUrl } = await createRepNameUseCase({ shopId, userId, body });

        res.status(200).json({ frontSignedUrl, rearSignedUrl });
    } catch (err) {
        next(err);
    }
};

// POST /shop-info-edit/:id/company-name
// summary: 会社名変更リクエスト
// page: /edit/shop/company-name/[id]
export const shopInfoEditPostByIdCompanyNameController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        const body = req.validatedBody as CreateCompanyNameBody;
        const companyName = body.companyName;

        await createCompanyNameUseCase({ shopId, userId, companyName });

        res.status(200).json({ message: "会社名の変更を受け付けました。" });
    } catch (err) {
        next(err);
    }
};

// POST /shop-info-edit/:id/com-free
// summary: 事業形態変更リクエスト
// page: /edit/shop/com-free/[id]
export const shopInfoEditPostByIdComFreeController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const shopId = Number(req.params.id);
        const userId = req.user!.id;

        const body = req.validatedBody as ComFreeIdBody;
        const comFreeId = body.selectOption;

        const editId = await createShopEditComFreeUseCase({ shopId, userId, comFreeId });

        res.status(200).json({ editId });
    } catch (err) {
        next(err);
    }
};

// PATCH /shop-info-edit/:id
// summary: 事業形態変更確認ページ データ更新
// page: /edit/shop/com-free/confirm/[id]
export const shopInfoEditPatchByIdController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const shopEditId = Number(req.params.id);
        const userId = req.user!.id;
        const updateData = req.body;

        await updateShopEditAnyUseCase({ shopEditId, userId, updateData });

        res.status(200).json({ message: "更新しました" });
    } catch (err) {
        next(err);
    }
};

// PATCH /shop-info-edit/:id/id-image-upload
// summary: 事業者登録 代表者身分証アップロード
// page: edit/shop/com-free/upload/[id]
export const shopInfoEditPatchByIdIdImageUploadController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const shopEditId = Number(req.params.id);
        const userId = req.user!.id;
        const body = req.validatedBody as ShopIdCardBody;

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
};

// GET /shop-info-edit/:id/address
// summary: shopEdit住所取得
// page: /edit/address/shop/com-free/[id]
export const shopInfoEditGetByIdAddressController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const shopEditId = Number(req.params.id);
        const userId = req.user!.id;

        const data = await getAddressShopEditUseCase({ shopEditId, userId });

        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
};

// GET /shop-info-edit/:id/bank-account
// summary: shopEdit口座情報取得
// page: /edit/account/shop/com-free/[id]
export const shopInfoEditGetByIdBankAccountController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const shopEditId = Number(req.params.id);
        const userId = req.user!.id;

        const data = await getBankAccountShopEditUseCase({ shopEditId, userId });

        res.status(200).json({ data });
    } catch (err) {
        next(err);
    }
};

// GET /shop-info-edit/:id/rep-name
// summary: shopEdit代表者氏名取得
// page: /edit/name/shop/rep-name/com-free/[id]
export const shopInfoEditGetByIdRepNameController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const shopEditId = Number(req.params.id);
        const userId = req.user!.id;

        const name = await getRepNameEditUseCase({ shopEditId, userId });

        res.status(200).json({ name });
    } catch (err) {
        next(err);
    }
};

// GET /shop-info-edit/:id/con-name
// summary: shopEdit担当者氏名取得
// page: /edit/name/shop/con-name/com-free/[id]
export const shopInfoEditGetByIdConNameController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const shopEditId = Number(req.params.id);
        const userId = req.user!.id;

        const name = await getConNameEditUseCase({ shopEditId, userId });

        res.status(200).json({ name });
    } catch (err) {
        next(err);
    }
};

// GET /shop-info-edit/:id/com-free-confirm
// summary: 事業形態変更確認ページデータ取得
// page: /edit/shop/com-free/confirm/[id]
export const shopInfoEditGetByIdComFreeConfirmController = async (
    req: Request,
    res: Response,
    next: NextFunction,
): Promise<void> => {
    try {
        const shopEditId = Number(req.params.id);
        const userId = req.user!.id;

        const shopEdit = await getShopComFreeConfirmUseCase({ shopEditId, userId });

        res.status(200).json({ shopEdit });
    } catch (err) {
        next(err);
    }
};
