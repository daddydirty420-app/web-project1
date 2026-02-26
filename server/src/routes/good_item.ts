import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { authenticateOptional, authenticateToken } from "../middleware/index.js";
import { GoodItem, Item, User, Follow, ShopInfo, Video, Sale } from "../models/index.js";

const router = Router();

router.post('/add/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user!.id;
    const itemId = req.params.id;

    try {
        const data = await GoodItem.findOne({
            where: {
                good_user_id: currentUserId,
                item_id: itemId,
            },
        });
        if (data) {
            res.status(409).json({ message: 'すでにいいね済みです。' });
            return;
        }

        const item = await Item.findByPk(itemId);
        if (!item) {
            res.status(404).json({ message: '商品が見つかりません。' });
            return;
        }

        await GoodItem.create({
            item_id: itemId,
            good_user_id: currentUserId,
        });

        if (!item.sold_out) {
            item.sort_number = Number(item.sort_number) + 50;
            item.sort_buzz_number = Number(item.sort_buzz_number) + 200;
            await item.save();
        }

        res.status(200).json({ isGood: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.delete('/remove/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const itemId = req.params.id;
    const currentUserId = req.user!.id;

    try {
        const data = await GoodItem.findOne({
            where: {
                item_id: itemId,
                good_user_id: currentUserId,
            },
        });
        if (!data) {
            res.status(409).json({ message: 'いいねしていません。' });
            return;
        }

        const item = await Item.findByPk(itemId);
        if (!item) {
            res.status(404).json({ message: '商品が見つかりません。' });
            return;
        }

        await data.destroy();

        if (!item.sold_out && item.sort_number > 0) {
            const sortNumber = Number(item.sort_number);
            const newSort = sortNumber - Math.min(50, sortNumber);
            item.sort_number = newSort;
            await item.save();
        }

        if (!item.sold_out && item.sort_buzz_number > 0) {
            const sortBuzzNumber = Number(item.sort_buzz_number);
            const newSortBuzz = sortBuzzNumber - Math.min(200, sortBuzzNumber);
            item.sort_buzz_number = newSortBuzz;
            await item.save();
        }

        res.status(200).json({ isGood: false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/status/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const isGood = await GoodItem.findOne({
            where: {
                good_user_id: req.user!.id,
                item_id: req.params.id,
            },
        });

        res.status(200).json({ isGood: !!isGood });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/count/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const count = await GoodItem.count({
            where: { item_id: req.params.id },
        });

        res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/good-user-list/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    type FollowInstance = InstanceType<typeof Follow>
    type UserInstance = InstanceType<typeof User>;
    
    const currentUserId = req.user!.id;
    const itemId = req.params.id;

    try {
        const goodItemList = await GoodItem.findAll({
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

        const userCount = goodItemList.length;

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

        if (!goodItemList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        const source = finalGoodList ?? goodItemList;

        const userList = source.map(item => {
            const plain = item.toJSON ? item.toJSON() : item;
            return plain.User;
        });

        res.status(200).json({ userList, userCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。'});
    }
});

router.get('/good-user-list/search/:id', authenticateOptional, async (req: Request, res: Response): Promise<void> => {
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
        const goodItemList = await GoodItem.findAll({
            where: { item_id: itemId },
            order: [['createdAt', 'DESC']],
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
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。'});
    }
});

router.get('/like-item/video-list', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const currentUserId = req.user!.id;

        const page = parseInt(req.query.page as string) || 1;
        const limit = 12;
        const offset = (page - 1) * limit;

        const itemList = await GoodItem.findAll({
            where: { good_user_id: currentUserId },
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'price', "status"],
                    include: [
                        {
                            model: Video,
                            attributes: ['thumbnail_url', 'title', 'duration']
                        },
                        {
                            model: User,
                            attributes: ['id', 'user_name', 'profile_image']
                        },
                        {
                            model: Sale,
                            attributes: ['before_price', 'discount_rate', 'discount_amount', 'sale_flag']
                        },
                    ],
                },
            ],
        });

        if (!itemList) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        res.json({ itemList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。'});
    }
});

router.get('/like-item/item-list', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const currentUserId = req.user!.id;

        const page = parseInt(req.query.page as string) || 1;
        const limit = Number(req.query.limit) || 18;
        const offset = (page - 1) * limit;

        const itemList = await GoodItem.findAll({
            where: { good_user_id: currentUserId },
            order: [['createdAt', 'DESC']],
            limit,
            offset,
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name', 'price', 'status', "first_image_url"],
                    include: [
                        {
                            model: Sale,
                            attributes: ['discount_rate', 'discount_amount', 'sale_flag'],
                        },
                    ],
                },
            ],
        });

        if (!itemList) {
            res.status(404).json({ message: 'アイテムが見つかりません。' });
            return;
        }

        res.json({ itemList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。'});
    }
});

export default router;