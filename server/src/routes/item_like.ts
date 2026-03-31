import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { authenticateOptional, authenticateToken } from "../middleware/index.js";
import { ItemLike, User, Follow, ShopInfo } from "../models/index.js";
import { deleteItemLike } from "../services/itemLike/delete.service.js";
import { addItemLike } from "../services/itemLike/add.service.js";
import { itemLikeStatus } from "../services/itemLike/status.service.js";
import { itemLikeCount } from "../services/itemLike/count.service.js";

const router = Router();

// POST /item-like/:id
router.post('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await addItemLike({ itemId, userId });

        res.status(200).json({ isGood: true });
    } catch (err) {
        next(err);
    }
});

// DELETE /item-like/:id
router.delete('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await deleteItemLike({ itemId, userId });

        res.status(200).json({ isGood: false });
    } catch (err) {
        next(err);
    }
});

// GET /item-like/:id/status
router.get('/:id/status', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        const isGood = await itemLikeStatus({ itemId, userId });

        res.status(200).json({ isGood });
    } catch (err) {
        next(err);
    }
});

// GET /item-like/:id/count
router.get('/:id/count', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    try {
        const count = await itemLikeCount({ itemId });

        res.status(200).json({ count });
    } catch (err) {
        next(err);
    }
});

router.get('/like-user-list/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    type FollowInstance = InstanceType<typeof Follow>
    type UserInstance = InstanceType<typeof User>;
    
    const currentUserId = req.user!.id;
    const itemId = req.params.id;

    try {
        const goodItemList = await ItemLike.findAll({
            attributes: ["id"],
            where: { item_id: itemId },
            order: [['createdAt', 'DESC']],
            distinct: true,
            include: [
                {
                    model: User,
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
        }) as UserInstance[];

        let finalGoodList = null;

        if (currentUserId !== null) {
            const targetUserIds = goodItemList.map(user => user.User.id);

            const followings = await Follow.findAll({
                where: {
                    follow_user_id: currentUserId,
                    follower_user_id: targetUserIds
                }
            }) as FollowInstance[];

            const followingUserIdSet = new Set(followings.map(f => f.follower_user_id));

            finalGoodList = goodItemList.map(item => {
                const plainItem = item.toJSON();
                const targetId = plainItem.User?.id;
                plainItem.User.is_following = followingUserIdSet.has(targetId);
                return plainItem;
            });
        }

        const source = finalGoodList ?? goodItemList;

        const userList = source.map(item => {
            const plain = item.toJSON ? item.toJSON() : item;
            return plain.User;
        });

        res.status(200).json({ userList });
    } catch (err) {
        next(err);
    }
});

router.get('/like-user-list/search/:id', authenticateOptional, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    type FollowInstance = InstanceType<typeof Follow>
    type UserInstance = InstanceType<typeof User>;
        
    const currentUserId = req.user?.id ?? null;
    const itemId = req.params.id;
    const keyword = req.query?.keyword ?? "";
    if (!String(keyword).trim()) {
        res.status(400).json({ message: "検索キーワードがありません" });
        return;
    }

    try {
        const goodItemList = await ItemLike.findAll({
            attributes: ["id"],
            where: { item_id: itemId },
            order: [['createdAt', 'DESC']],
            distinct: true,
            include: [
                {
                    model: User,
                    attributes: ['id', 'user_name', 'profile_image', 'honnin_verified', "early_seller"],
                    where: {
                        user_name: { [Op.iLike]: `%${String(keyword).trim().toLowerCase()}%`}
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
        }) as UserInstance[];

        let finalGoodList = null;

        if (currentUserId !== null && goodItemList.length > 0) {
            const targetUserIds = goodItemList.map(user => user.User.id);

            const followings = await Follow.findAll({
                where: {
                    follow_user_id: currentUserId,
                    follower_user_id: targetUserIds
                }
            }) as FollowInstance[];

            const followingUserIdSet = new Set(followings.map(f => f.follower_user_id));

            finalGoodList = goodItemList.map(item => {
                const plainItem = item.toJSON();
                const targetId = plainItem.User?.id;
                plainItem.User.is_following = followingUserIdSet.has(targetId);
                return plainItem;
            });
        }

        const source = finalGoodList ?? goodItemList;

        const userList = source.map(item => {
            const plain = item.toJSON ? item.toJSON() : item;
            return plain.User;
        });

        res.status(200).json({ userList });
    } catch (err) {
        next(err);
    }
});

export default router;