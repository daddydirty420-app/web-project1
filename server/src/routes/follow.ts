import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { authenticateOptional, authenticateToken } from "../middleware/index.js";
import { Follow, User, ShopInfo } from "../models/index.js";

const router = Router();

router.post('/add/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user!.id;
    const targetUserId = Number(req.params.id);
    if (!currentUserId || currentUserId === targetUserId) {
        res.status(404).json({ message: 'ユーザーが見つかりません。' });
        return;
    }

    try {
        const status = await Follow.findOne({
            where: {
                follow_user_id: currentUserId,
                follower_user_id: targetUserId
            }
        });
        const alreadyFollowing = !!status;
        if (alreadyFollowing) {
            res.status(409).json({ message: 'すでにフォローしています。' });
            return;
        }

        const data = await Follow.create({
            follow_user_id: currentUserId,
            follower_user_id: targetUserId
        });

        res.status(200).json({
            data,
            success: true,
            isFollowing: true
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.delete('/remove/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user!.id;
    const targetUserId = Number(req.params.id);
    if (!currentUserId || currentUserId === targetUserId) {
        res.status(404).json({ message: 'ユーザーが見つかりません。' });
        return;
    }

    try {
        const status = await Follow.findOne({
            where: {
                follow_user_id: currentUserId,
                follower_user_id: targetUserId
            }
        });
        if (!status) {
            res.status(409).json({ message: 'フォローしていません。' });
            return;
        }

        await status.destroy();

        res.status(200).json({
            success: true,
            isFollowing: false
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/status', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const currentUserId = req.user!.id;
        const targetUserId = Number(req.query.to);

        if (!currentUserId || currentUserId === targetUserId) {
            res.json({ isFollowing: false });
            return;
        }

        const isFollowing = await Follow.findOne({
            where: {
                follow_user_id: currentUserId,
                follower_user_id: targetUserId
            }
        });

        res.json({ isFollowing: !!isFollowing });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get("/count/:id", async (req: Request, res: Response): Promise<void> => {
    const userId = req.params.id;

    try {
        const [followCount, followerCount] = await Promise.all([
            Follow.count({ where: { follow_user_id: userId } }),
            Follow.count({ where: { follower_user_id: userId } }),
        ]);

        if (followCount === null || followerCount === null) {
            res.status(400).json({ message: "数値を取得できません。" });
            return;
        }

        res.status(200).json({ followCount, followerCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get('/follow-list/:id', authenticateOptional, async (req: Request, res: Response): Promise<void> => {
    type FollowInstance = InstanceType<typeof Follow>;
    type UserInstance = InstanceType<typeof User>;
        
    const currentUserId = req.user?.id ?? null;
    const pageUserId = Number(req.params.id);

    const myFollow = !!(currentUserId === pageUserId);

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

        const previewFollowList = source.map(item => {
            const plain = item.toJSON ? item.toJSON() : item;
            return plain.FollowerUser;
        });

        const pageUser = await User.findByPk(pageUserId, {
            attributes: ['id', 'user_name'],
        });

        if (!pageUser) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        const followCount = previewFollowList.length;

        const followerCount = await Follow.count({
            where: { follower_user_id: pageUserId },
        });

        res.status(200).json({
            previewFollowList,
            pageUser,
            followCount,
            followerCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。'});
    }
});

router.get("/follower-list/:id", authenticateOptional, async (req: Request, res: Response): Promise<void> => {
    type FollowInstance = InstanceType<typeof Follow>;
    type UserInstance = InstanceType<typeof User>;
        
    const currentUserId = req.user?.id ?? null;
    const pageUserId = Number(req.params.id);

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
                    include: [
                        {
                            model: ShopInfo,
                            attributes: ['id'],
                            required: true,
                        },
                    ],
                },
            ],
        }) as (FollowInstance & { FollowUser?: UserInstance })[];

        let finalFollowerList = null;

        if (currentUserId !== null && followerList.length > 0) {
            const targetUserIds = followerList.map(user => user.FollowUser.id);

            const followings = await Follow.findAll({
                where: {
                    follow_user_id: currentUserId,
                    follower_user_id: targetUserIds
                }
            }) as FollowInstance[];

            const followingUserIdSet = new Set(followings.map((f: FollowInstance) => f.follower_user_id));

            finalFollowerList = followerList.map(item => {
                const plainItem = item.toJSON();
                const targetId = plainItem.FollowUser?.id;
                plainItem.FollowUser.is_following = followingUserIdSet.has(targetId);
                return plainItem;
            });
        }

        const source = finalFollowerList ?? followerList;

        const previewFollowerList = source.map(item => {
            const plain = item.toJSON ? item.toJSON() : item;
            return plain.FollowUser;
        });

        const pageUser = await User.findByPk(pageUserId, {
            attributes: ['id', 'user_name'],
        });

        if (!pageUser) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        const followCount = await Follow.count({
            where: { follow_user_id: pageUserId },
        });

        const followerCount = previewFollowerList.length;

        res.status(200).json({
            previewFollowerList,
            pageUser,
            followCount,
            followerCount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。'});
    }
});

router.get('/follow-list/search/:id', authenticateOptional, async (req: Request, res: Response): Promise<void> => {
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

        const previewFollowList = source.map(item => {
            const plain = item.toJSON ? item.toJSON() : item;
            return plain.FollowerUser;
        });

        res.status(200).json({ previewFollowList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。'});
    }
});

router.get('/follower-list/search/:id', authenticateOptional, async (req: Request, res: Response): Promise<void> => {
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

        const previewFollowerList = source.map(item => {
            const plain = item.toJSON ? item.toJSON() : item;
            return plain.FollowUser;
        });

        res.status(200).json({ previewFollowerList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。'});
    }
});

export default router;