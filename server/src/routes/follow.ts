import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { authenticateOptional, authenticateToken } from "../middleware/index.js";
import { Follow, User, ShopInfo } from "../models/index.js";
import { followStatus } from "../services/follow/status.service.js";
import { followsCount } from "../services/follow/count.service.js";
import { followAdd } from "../services/follow/add.service.js";
import { followDelete } from "../services/follow/delete.service.js";
import { FollowType, getFollowUserList } from "../services/follow/userList.service.js";

const router = Router();

// POST /follow/:id
router.post('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const currentUserId = req.user!.id;

    const targetUserId = Number(req.params.id);

    if (!currentUserId || currentUserId === targetUserId) {
        res.status(404).json({ message: 'ユーザーが見つかりません。' });
        return;
    }

    try {
        await followAdd({ currentUserId, targetUserId });

        res.status(200).json({ message: "フォローしました" });
    } catch (err) {
        next(err);
    }
});

// DELETE /follow/:id
router.delete('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const currentUserId = req.user!.id;

    const targetUserId = Number(req.params.id);

    if (!currentUserId || currentUserId === targetUserId) {
        res.status(404).json({ message: 'ユーザーが見つかりません。' });
        return;
    }

    try {
        await followDelete({ currentUserId, targetUserId });

        res.status(200).json({ message: "フォロー解除しました" });
    } catch (err) {
        next(err);
    }
});

// GET /follow/:id/status
router.get('/:id/status', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const currentUserId = req.user!.id;
        
    const targetUserId = Number(req.params.id);

    if (!currentUserId || currentUserId === targetUserId) {
        res.json({ isFollowing: false });
        return;
    }

    try {
        const isFollowing = await followStatus({ currentUserId, targetUserId });

        res.status(200).json({ isFollowing });
    } catch (err) {
        next(err);
    }
});

// GET /follow/:id/count
router.get("/:id/count", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = Number(req.params.id);

    try {
        const { followCount, followerCount } = await followsCount({ userId });

        res.status(200).json({ followCount, followerCount });
    } catch (err) {
        next(err);
    }
});

// GET /follow/:id/user?type=""(&keyword="")
router.get('/:id/user', authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {    
    const currentUserId = req.user?.id ?? null;
    const pageUserId = Number(req.params.id);

    const type = req.query.type as FollowType;

    const keyword = req.query.keyword as string | undefined;

    try {
        const {
            userList,
            pageUser
        } = await getFollowUserList({ currentUserId, pageUserId, type, keyword });

        res.status(200).json({
            userList,
            pageUser
        });
    } catch (err) {
        next(err);
    }
});

export default router;