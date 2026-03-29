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

// GET /follow/:id?type=""
router.get('/:id', authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {    
    const currentUserId = req.user?.id ?? null;
    const pageUserId = Number(req.params.id);

    const type = req.query.type as FollowType;

    try {
        const {
            userList,
            pageUser
        } = await getFollowUserList({ currentUserId, pageUserId, type });

        res.status(200).json({
            userList,
            pageUser
        });
    } catch (err) {
        next(err);
    }
});

router.get('/follow-list/search/:id', authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    type FollowInstance = InstanceType<typeof Follow>;
    type UserInstance = InstanceType<typeof User>;

    const currentUserId = req.user?.id ?? null;
    const pageUserId = Number(req.params.id);

    const myFollow = !!(currentUserId === pageUserId);

    const keyword = req.query?.keyword ?? "";
    if (!String(keyword).trim()) {
        res.status(400).json({ message: "検索キーワードがありません" });
        return;
    }

    try {
        const followList = await Follow.findAll({
            attributes: ["id"],
            where: { follow_user_id: pageUserId },
            order: [['createdAt', 'DESC']],
            distinct: true,
            include: [
                {
                    model: User,
                    as: 'FollowerUser',
                    attributes: ['id', 'user_name', 'profile_image', 'honnin_verified', "early_seller"],
                    where: {
                        user_name: { [Op.iLike]: `%${String(keyword).trim()}%` }
                    },
                    include: [
                        {
                            model: ShopInfo,
                            attributes: ['id'],
                            required: false,
                        },
                    ],
                },
            ],
        }) as (FollowInstance & { FollowUser?: UserInstance })[];

        let finalFollowList = null;

        if (currentUserId !== null && followList.length > 0 && !myFollow) {
            const targetUserIds = followList.map(user => user.FollowerUser.id);

            const followings = await Follow.findAll({
                where: {
                    follow_user_id: currentUserId,
                    follower_user_id: targetUserIds
                }
            }) as FollowInstance[];

            const followingUserIdSet = new Set(followings.map((f: FollowInstance) => f.follower_user_id));

            finalFollowList = followList.map(item => {
                const plainItem = item.toJSON();
                const targetId = plainItem.FollowerUser?.id;
                plainItem.FollowerUser.is_following = followingUserIdSet.has(targetId);
                return plainItem;
            });
        }

        const source = finalFollowList ?? followList;

        const userList = source.map(item => {
            const plain = item.toJSON ? item.toJSON() : item;
            return plain.FollowerUser;
        });

        res.status(200).json({ userList });
    } catch (err) {
        next(err);
    }
});

router.get('/follower-list/search/:id', authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    type UserInstance = InstanceType<typeof User>;
    type FollowInstance = InstanceType<typeof Follow>;
        
    const currentUserId = req.user?.id ?? null;
    const pageUserId = Number(req.params.id);
    const keyword = req.query?.keyword ?? "";
    if (!String(keyword).trim()) {
        res.status(400).json({ message: "検索キーワードがありません" });
        return;
    }

    try {
        const followerList = await Follow.findAll({
            attributes: ["id"],
            where: { follower_user_id: pageUserId },
            order: [['createdAt', 'DESC']],
            distinct: true,
            include: [
                {
                    model: User,
                    as: 'FollowUser',
                    attributes: ['id', 'user_name', 'profile_image', 'honnin_verified', "early_seller"],
                    where: {
                        user_name: { [Op.iLike]: `%${String(keyword).trim()}%` }
                    },
                    include: [
                        {
                            model: ShopInfo,
                            attributes: ['id'],
                            required: false,
                        },
                    ],
                },
            ],
        }) as (FollowInstance & { FollowUser?: UserInstance })[];

        let finalFollowerList = null;

        if (currentUserId !== null && followerList.length > 0) {
            const targetUserIds = followerList.map(user => user.FollowerUser.id);

            const followings = await Follow.findAll({
                where: {
                    follow_user_id: currentUserId,
                    follower_user_id: targetUserIds
                }
            }) as FollowInstance[];

            const followingUserIdSet = new Set(followings.map(f => f.follower_user_id));

            finalFollowerList = followerList.map(item => {
                const plainItem = item.toJSON();
                const targetId = plainItem.FollowerUser?.id;
                plainItem.FollowerUser.is_following = followingUserIdSet.has(targetId);
                return plainItem;
            });
        }

        const source = finalFollowerList ?? followerList;

        const userList = source.map(item => {
            const plain = item.toJSON ? item.toJSON() : item;
            return plain.FollowUser;
        });

        res.status(200).json({ userList });
    } catch (err) {
        next(err);
    }
});

export default router;