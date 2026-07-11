import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateOptional, authenticateToken } from "../middleware/index.js";
import {
    editPhoneNumberRateLimit,
    getHonninRateLimit,
    getInquiryRateLimit,
    getMyPageRateLimit,
    getPhoneNumberRateLimit,
    getPointsRateLimit,
    getProfileEditRateLimit,
    getProfileMetadataRateLimit,
    getProfileRateLimit,
    getStarRateLimit,
    getTransferPointsRateLimit,
    getTransferRequestRateLimit,
    profileEditRateLimit,
    requestHonninRateLimit,
} from "../middleware/rateLimit/usersRateLimit.js";
import { validateBody } from "../middleware/validate/validateBody.js";
import { validateParams } from "../middleware/validate/validateParams.js";
import { validateQuery } from "../middleware/validate/validateQuery.js";
import { getProfileMetadata, getStar } from "../services/users/query.js";
import { editHonninUserUseCase } from "../usecases/users/edit/honnin.js";
import { editPhoneNumber } from "../usecases/users/edit/phoneNumber.js";
import { editProfileUseCase } from "../usecases/users/edit/profile.js";
import { getHonninEditUseCase } from "../usecases/users/get/getHonnin.js";
import { getInquiryUserUseCase } from "../usecases/users/get/getInquiryUser.js";
import { getMyPageUseCase } from "../usecases/users/get/getMyPage.js";
import { getPhoneNumberUseCase } from "../usecases/users/get/getPhoneNumber.js";
import { getMePointsUseCase } from "../usecases/users/get/getPoints.js";
import { getProfileUseCase } from "../usecases/users/get/getProfile.js";
import { getProfileEditDataUseCase } from "../usecases/users/get/getProfileEditData.js";
import { getUserTransferPointsUseCase } from "../usecases/users/get/getTransferPoints.js";
import { getUserTransferRequestUseCase } from "../usecases/users/get/getTransferRequest.js";
import {
    HonninBody,
    honninBodySchema,
    PhoneNumberBody,
    phoneNumberBodySchema,
    ProfileEditBody,
    profileEditBodySchema,
} from "../validators/body/users.js";
import { idParamSchema } from "../validators/params/id.js";
import {
    GetProfileQuery,
    getProfileQuerySchema,
    ProfileEditQuery,
    profileEditQuerySchema,
} from "../validators/query/users.js";

const router = Router();

// PATCH /user/profile?imageEdit=boolean
// summary: プロフィール編集
// page: /edit/profile
router.patch(
    "/profile",
    authenticateToken,
    profileEditRateLimit,
    validateQuery(profileEditQuerySchema),
    validateBody(profileEditBodySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        const query = req.validatedQuery as ProfileEditQuery;
        const imageEdit = query.imageEdit;

        const body = req.validatedBody as ProfileEditBody;

        try {
            const signedUrl = await editProfileUseCase({ userId, body, imageEdit });

            res.status(200).json({ signedUrl });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /user/phone-number
// summary: 電話番号変更
// page: /edit/phone-number
router.patch(
    "/phone-number",
    authenticateToken,
    editPhoneNumberRateLimit,
    validateBody(phoneNumberBodySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        const body = req.validatedBody as PhoneNumberBody;
        const phoneNumber = body.phoneNumber;

        try {
            await editPhoneNumber({ userId, phoneNumber });

            res.status(200).json({ message: "電話番号を更新しました。" });
        } catch (err) {
            next(err);
        }
    },
);

// PATCH /user/honnin
// summary: 本人確認リクエスト
// page: /edit/honnin
router.patch(
    "/honnin",
    authenticateToken,
    requestHonninRateLimit,
    validateBody(honninBodySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;
        const body = req.validatedBody as HonninBody;

        try {
            const { frontSignedUrl, rearSignedUrl } = await editHonninUserUseCase({ userId, body });

            res.status(200).json({
                frontSignedUrl,
                rearSignedUrl,
            });
        } catch (err) {
            next(err);
        }
    },
);

// GET /:id/profile?page=number&limit=number
// summary: プロフィール表示データ取得
// page: /profile/[id]
router.get(
    "/:id/profile",
    getProfileRateLimit,
    validateParams(idParamSchema),
    validateQuery(getProfileQuerySchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = Number(req.params.id);

        const query = req.validatedQuery as GetProfileQuery;
        const { page, limit } = query;

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
// summary: スター数取得
// page: /profileなど
router.get(
    "/:id/star",
    getStarRateLimit,
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
// summary: プロフィールページ　メタデータ
// page: /profile/[id]
router.get(
    "/:id/profile/metadata",
    getProfileMetadataRateLimit,
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
// summary: マイページ表示データ取得
// page: /my-page
router.get(
    "/my-page",
    getMyPageRateLimit,
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    },
);

// GET /user/inquiry
// summary: お問い合わせフォーム表示データ取得
// page: /inquiry
router.get(
    "/inquiry",
    getInquiryRateLimit,
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const user = await getInquiryUserUseCase({ userId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    },
);

// GET /user/phone-number
// summary: 電話番号取得
// page: /edit/phone-number
router.get(
    "/phone-number",
    getPhoneNumberRateLimit,
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
// summary: プロフィール編集ページ表示データ取得
// page: /edit/profile
router.get(
    "/profile-edit-data",
    getProfileEditRateLimit,
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
// summary: 本人確認フォーム表示データ取得
// page: /edit/honnin
router.get(
    "/honnin",
    getHonninRateLimit,
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    },
);

// GET /user/transfer-points
// summary: ポイント変換ページ　表示データ取得
// page: /transfer/points
router.get(
    "/transfer-points",
    getTransferPointsRateLimit,
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
    getTransferRequestRateLimit,
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

// GET /user/current-points
// summary: 現在の所有ポイント取得
// page: /history/points
router.get(
    "/current-points",
    getPointsRateLimit,
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const user = await getMePointsUseCase({ userId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    },
);

// GET /user/current-uriagekin
// summary: 現在の所有売上金取得
// page: /history/uriagekin

// GET /user/me
router.get("/me", authenticateOptional, async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ currentUserId: req.user?.id ?? null });
});

// GET /user/me-admin
router.get("/me-admin", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ admin: !!req.user!.admin });
});

export default router;
