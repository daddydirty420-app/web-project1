import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { authenticateOptional, authenticateToken } from "../middleware/index.js";
import { validateBody } from "../middleware/validateBody.js";
import { validateParams } from "../middleware/validateParams.js";
import { validateQuery } from "../middleware/validateQuery.js";
import { getProfileMetadata, getStar } from "../services/users/query.js";
import { editHonninUserUseCase } from "../usecases/users/edit/honnin.js";
import { editPhoneNumber } from "../usecases/users/edit/phoneNumber.js";
import { editProfileUseCase } from "../usecases/users/edit/profile.js";
import { getHonninEditUseCase } from "../usecases/users/get/getHonnin.js";
import { getInquiryUserUseCase } from "../usecases/users/get/getInquiryUser.js";
import { getMyPageUseCase } from "../usecases/users/get/getMyPage.js";
import { getPhoneNumberUseCase } from "../usecases/users/get/getPhoneNumber.js";
import { getProfileUseCase } from "../usecases/users/get/getProfile.js";
import { getProfileEditDataUseCase } from "../usecases/users/get/getProfileEditData.js";
import { getUserTransferPointsUseCase } from "../usecases/users/get/getTransferPoints.js";
import { getUserTransferRequestUseCase } from "../usecases/users/get/getTransferRequest.js";
import { ProfileEditBody, profileEditBodySchema } from "../validators/body/users.js";
import { idParamSchema } from "../validators/params/id.js";
import { ProfileEditQuery, profileEditQuerySchema } from "../validators/query/users.js";

const router = Router();

// PATCH /user/profile?imageEdit=boolean
// summary: プロフィール編集
// page: /edit/profile/[id]
router.patch(
    "/profile",
    validateQuery(profileEditQuerySchema),
    validateBody(profileEditBodySchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        const query = req.validatedQuery as ProfileEditQuery;
        const imageEdit = query.imageEdit;

        const body = req.validatedBody as ProfileEditBody;

        try {
            const signedUrl = await editProfileUseCase({ userId, body, imageEdit });

            res.status(200).json({
                message: "プロフィール更新完了！",
                signedUrl,
            });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /user/phone-number
router.patch(
    "/phone-number",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;
        const phoneNumber = req.body.phoneNumber?.trim();

        if (!phoneNumber || !/^[0-9]+$/.test(phoneNumber)) {
            throw new AppError("INVALID_PHONE_NUMBER", 400);
        }

        try {
            await editPhoneNumber({ userId, phoneNumber });

            res.status(200).json({ message: "電話番号を更新しました。" });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /user/honnin
router.patch("/honnin", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;
    const body = req.body;

    try {
        const { frontSignedUrl, rearSignedUrl } = await editHonninUserUseCase({ userId, body });

        res.status(200).json({
            message: "本人確認のリクエストが完了しました。",
            frontSignedUrl,
            rearSignedUrl,
        });
    } catch (err) {
        next(err);
    }
});

// GET /user/me
router.get("/me", authenticateOptional, async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ currentUserId: req.user?.id ?? null });
});

// GET /user/me-admin
router.get("/me-admin", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ admin: !!req.user!.admin });
});

// GET /:id/profile
router.get(
    "/:id/profile",
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = Number(req.params.id);

        const page = parseInt(req.query.page as string) || 1;
        const limit = Number(req.query.limit) || 6;

        try {
            const { user, hasShop, items, hasItemCount, totalPages } = await getProfileUseCase({ userId, page, limit });

            res.status(200).json({
                user,
                hasShop,
                itemList: {
                    items,
                    hasItemCount,
                    totalPages,
                },
            });
        } catch (err) {
            next(err);
        }
    },
);

// GET /user/:id/star
router.get(
    "/:id/star",
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = Number(req.params.id);

        try {
            const user = await getStar({ userId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    },
);

// GET /user/:id/profile/metadata
router.get(
    "/:id/profile/metadata",
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = Number(req.params.id);

        try {
            const user = await getProfileMetadata({ userId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    },
);

// GET /user/my-page
router.get("/my-page", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;

    try {
        const { user, hasShop, itemCount, soldItemCount, unreadCount, referenceCount } = await getMyPageUseCase({
            userId,
        });

        res.status(200).json({
            userData: {
                user,
                hasShop,
            },
            itemCount,
            soldItemCount,
            unreadCount,
            referenceCount,
        });
    } catch (err) {
        next(err);
    }
});

// GET /user/inquiry
router.get("/inquiry", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;

    try {
        const user = await getInquiryUserUseCase({ userId });

        res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
});

// GET /user/phone-number
router.get(
    "/phone-number",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const user = await getPhoneNumberUseCase({ userId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    },
);

// GET /user/profile-edit-data
router.get(
    "/profile-edit-data",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const user = await getProfileEditDataUseCase({ userId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    },
);

// GET /user/honnin
router.get("/honnin", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;

    try {
        const { user, genderAllOptions } = await getHonninEditUseCase({ userId });

        res.status(200).json({
            user,
            genderAllOptions,
        });
    } catch (err) {
        next(err);
    }
});

// GET /user/transfer-points
// summary: ポイント変換ページ　表示データ取得
// page: /transfer/points
router.get(
    "/transfer-points",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const user = await getUserTransferPointsUseCase({ userId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    },
);

// GET /user/transfer-request
// summary: 振込申請ページ　表示データ取得
// page: /transfer/request
router.get(
    "/transfer-request",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const user = await getUserTransferRequestUseCase({ userId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
