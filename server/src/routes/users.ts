import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { AppError } from "../errors.js";
import { authenticateOptional, authenticateToken } from "../middleware/index.js";
import { AccountTypeOption, BankAccount, User } from "../models/index.js";
import { getProfileMetadata, getStar } from "../services/users/query.js";
import { editHonninUserUseCase } from "../usecases/user/edit/honnin.js";
import { editPhoneNumber } from "../usecases/user/edit/phoneNumber.js";
import { editProfileUseCase } from "../usecases/user/edit/profile.js";
import { getHonninEditUseCase } from "../usecases/user/get/getHonnin.js";
import { getInquiryUserUseCase } from "../usecases/user/get/getInquiryUser.js";
import { getMyPageUseCase } from "../usecases/user/get/getMyPage.js";
import { getPhoneNumberUseCase } from "../usecases/user/get/getPhoneNumber.js";
import { getProfileUseCase } from "../usecases/user/get/getProfile.js";
import { getProfileEditDataUseCase } from "../usecases/user/get/getProfileEditData.js";

const router = Router();

// PATCH /user/profile?imageEdit=boolean
router.patch("/profile", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;
    const body = req.body;
    const imageEdit = req.query.imageEdit === "true";

    try {
        const signedUrl = await editProfileUseCase({ userId, body, imageEdit });

        res.status(200).json({
            message: "プロフィール更新完了！",
            signedUrl,
        });
    } catch (err) {
        next(err);
    }
});

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
router.get("/:id/profile", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
});

// GET /user/:id/star
router.get("/:id/star", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = Number(req.params.id);

    try {
        const user = await getStar({ userId });

        res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
});

// GET /user/:id/profile/metadata
router.get("/:id/profile/metadata", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = Number(req.params.id);

    try {
        const user = await getProfileMetadata({ userId });

        res.status(200).json({ user });
    } catch (err) {
        next(err);
    }
});

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

router.get(
    "/transfer-request",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const user = await User.findByPk(userId, {
                attributes: ["id", "uriagekin"],
                include: [
                    {
                        model: BankAccount,
                        attributes: ["id", "bank_name", "branch", "account_type_id", "account_number", "meigi"],
                        include: [{ model: AccountTypeOption }],
                    },
                ],
            });

            if (!user) {
                res.status(404).json({ message: "ユーザーが見つかりません。" });
                return;
            }

            res.json({ user });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    "/transfer-points",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;

        try {
            const user = await User.findByPk(userId, {
                attributes: ["id", "points", "uriagekin"],
            });

            if (!user) {
                res.status(404).json({ message: "ユーザーが見つかりません。" });
                return;
            }

            res.json({ user });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
