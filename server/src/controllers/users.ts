import type {
    NextFunction,
    Request,
    Response,
} from "express-serve-static-core";
import {
    getProfileMetadata,
    getStar,
} from "../services/users/query.js";
import { editHonninUserUseCase } from "../usecases/users/edit/honnin.js";
import { editPhoneNumber } from "../usecases/users/edit/phoneNumber.js";
import { editProfileUseCase } from "../usecases/users/edit/profile.js";
import { getHonninEditUseCase } from "../usecases/users/get/getHonnin.js";
import { getInquiryUserUseCase } from "../usecases/users/get/getInquiryUser.js";
import { getMyAccountUseCase } from "../usecases/users/get/getMyAccount.js";
import { getMyAddressUseCase } from "../usecases/users/get/getMyAddress.js";
import { getMyNameUseCase } from "../usecases/users/get/getMyName.js";
import { getMyPageUseCase } from "../usecases/users/get/getMyPage.js";
import { getPhoneNumberUseCase } from "../usecases/users/get/getPhoneNumber.js";
import { getMePointsUseCase } from "../usecases/users/get/getPoints.js";
import { getProfileUseCase } from "../usecases/users/get/getProfile.js";
import { getProfileEditDataUseCase } from "../usecases/users/get/getProfileEditData.js";
import { getUserTransferPointsUseCase } from "../usecases/users/get/getTransferPoints.js";
import { getUserTransferRequestUseCase } from "../usecases/users/get/getTransferRequest.js";
import { getMeUriagekinUseCase } from "../usecases/users/get/getUriagekin.js";
import {
    HonninBody,
    PhoneNumberBody,
    ProfileEditBody,
} from "../validators/body/users.js";
import {
    GetProfileQuery,
    ProfileEditQuery,
} from "../validators/query/users.js";

// PATCH /user/profile?imageEdit=boolean
// summary: プロフィール編集
// page: /edit/profile
export const usersPatchProfileController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    };

// PATCH /user/phone-number
// summary: 電話番号変更
// page: /edit/phone-number
export const usersPatchPhoneNumberController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        const body = req.validatedBody as PhoneNumberBody;
        const phoneNumber = body.phoneNumber;

        try {
            await editPhoneNumber({ userId, phoneNumber });

            res.status(200).json({ message: "電話番号を更新しました。" });
        } catch (err) {
            next(err);
        }
    };

// PATCH /user/honnin
// summary: 本人確認リクエスト
// page: /edit/honnin
export const usersPatchHonninController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    };

// GET /:id/profile?page=number&limit=number
// summary: プロフィール表示データ取得
// page: /profile/[id]
export const usersGetByIdProfileController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    };

// GET /user/:id/star
// summary: スター数取得
// page: /profileなど
export const usersGetByIdStarController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = Number(req.params.id);

        try {
            const user = await getStar({ userId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    };

// GET /user/:id/profile/metadata
// summary: プロフィールページ メタデータ
// page: /profile/[id]
export const usersGetByIdProfileMetadataController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = Number(req.params.id);

        try {
            const user = await getProfileMetadata({ userId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    };

// GET /user/my-page
// summary: マイページ表示データ取得
// page: /my-page
export const usersGetMyPageController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    };

// GET /user/inquiry
// summary: お問い合わせフォーム表示データ取得
// page: /inquiry
export const usersGetInquiryController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const user = await getInquiryUserUseCase({ userId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    };

// GET /user/phone-number
// summary: 電話番号取得
// page: /edit/phone-number
export const usersGetPhoneNumberController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const user = await getPhoneNumberUseCase({ userId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    };

// GET /user/profile-edit-data
// summary: プロフィール編集ページ表示データ取得
// page: /edit/profile
export const usersGetProfileEditDataController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const user = await getProfileEditDataUseCase({ userId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    };

// GET /user/honnin
// summary: 本人確認フォーム表示データ取得
// page: /edit/honnin
export const usersGetHonninController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    };

// GET /user/transfer-points
// summary: ポイント変換ページ 表示データ取得
// page: /transfer/points
export const usersGetTransferPointsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const user = await getUserTransferPointsUseCase({ userId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    };

// GET /user/transfer-request
// summary: 振込申請ページ 表示データ取得
// page: /transfer/request
export const usersGetTransferRequestController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const user = await getUserTransferRequestUseCase({ userId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    };

// GET /user/current-points
// summary: 現在の所有ポイント取得
// page: /history/points
export const usersGetCurrentPointsController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const user = await getMePointsUseCase({ userId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    };

// GET /user/current-uriagekin
// summary: 現在の所有売上金取得
// page: /history/uriagekin
export const usersGetCurrentUriagekinController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const user = await getMeUriagekinUseCase({ userId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    };

// GET /user/myaddress
// summary: 住所取得
// page: /edit/address
export const usersGetMyaddressController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const data = await getMyAddressUseCase({ userId });

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    };

// GET /user/myaccount
// summary: 口座情報取得
// page: /edit/account
export const usersGetMyaccountController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const data = await getMyAccountUseCase({ userId });

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    };

// GET /user/myname
// summary: 自分の氏名取得
// page: /edit/nameなど
export const usersGetMynameController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const name = await getMyNameUseCase({ userId });

            res.status(200).json({ name });
        } catch (err) {
            next(err);
        }
    };

// GET /user/me
export const usersGetMeController = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ currentUserId: req.user?.id ?? null });
};

// GET /user/me-admin
export const usersGetMeAdminController = async (req: Request, res: Response): Promise<void> => {
    res.status(200).json({ admin: !!req.user!.admin });
};
