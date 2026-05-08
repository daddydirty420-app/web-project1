import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateOptional, authenticateToken } from "../middleware/index.js";
import { validateParams } from "../middleware/validateParams.js";
import { validateQuery } from "../middleware/validateQuery.js";
import { addFollowUseCase } from "../usecases/follow/add.js";
import { countFollowUseCase } from "../usecases/follow/count.js";
import { deleteFollowUseCase } from "../usecases/follow/delete.js";
import { getFollowStatusUseCase } from "../usecases/follow/status.js";
import { getFollowUserListUseCase } from "../usecases/follow/userList.js";
import { idParamSchema } from "../validators/params/id.js";
import { FollowUserListQuery, followUserListQuerySchema } from "../validators/query/follow.js";

const router = Router();

// POST /follow/:id
// summary: フォロー作成
// page: フォローボタンがあるページ
router.post(
    "/:id",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const currentUserId = req.user!.id;
        const targetUserId = Number(req.params.id);

        try {
            await addFollowUseCase({ currentUserId, targetUserId });

            res.status(200).json({ message: "フォローしました" });
        } catch (err) {
            next(err);
        }
    },
);

// DELETE /follow/:id
// summary: フォロー削除
// page: フォローボタンがあるページ
router.delete(
    "/:id",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const currentUserId = req.user!.id;
        const targetUserId = Number(req.params.id);

        try {
            await deleteFollowUseCase({ currentUserId, targetUserId });

            res.status(200).json({ message: "フォロー解除しました" });
        } catch (err) {
            next(err);
        }
    },
);

// GET /follow/:id/status
// summary: フォローステータス取得
// page: フォローボタンがあるページ
router.get(
    "/:id/status",
    validateParams(idParamSchema),
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const currentUserId = req.user!.id;
        const targetUserId = Number(req.params.id);

        if (currentUserId === targetUserId) {
            res.status(200).json({ isFollowing: false });
            return;
        }

        try {
            const isFollowing = await getFollowStatusUseCase({ currentUserId, targetUserId });

            res.status(200).json({ isFollowing });
        } catch (err) {
            next(err);
        }
    },
);

// GET /follow/:id/count
// summary: フォロー・フォロワー数カウント取得
// page: フォロー・フォロワー数表示
router.get(
    "/:id/count",
    validateParams(idParamSchema),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = Number(req.params.id);

        try {
            const { followCount, followerCount } = await countFollowUseCase({ userId });

            res.status(200).json({ followCount, followerCount });
        } catch (err) {
            next(err);
        }
    },
);

// GET /follow/:id/user?type=""(&keyword="")
// summary: フォロー・フォロワーリスト取得
// page: /user-list/follow/[id]
router.get(
    "/:id/user",
    validateParams(idParamSchema),
    validateQuery(followUserListQuerySchema),
    authenticateOptional,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const currentUserId = req.user?.id ?? null;
        const pageUserId = Number(req.params.id);

        const query = req.validatedQuery as FollowUserListQuery;
        const { type, keyword } = query;

        try {
            const userList = await getFollowUserListUseCase({ currentUserId, pageUserId, type, keyword });

            res.status(200).json({ userList });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
