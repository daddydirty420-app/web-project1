import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { Op, Sequelize } from "sequelize";
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

router.post('/remove/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
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

router.get('/good-user-list/:id', authenticateOptional, async (req: Request, res: Response): Promise<void> => {
    type FollowInstance = InstanceType<typeof Follow>
    type UserInstance = InstanceType<typeof User>;

    try {
        const currentUserId = req.user?.id ?? null;

        const itemId = req.params.id;

        const userList = await GoodItem.findAll({
            where: { item_id: itemId },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'user_name', 'profile_image', 'verified'],
                    include: [
                        {
                            model: ShopInfo,
                            attributes: ['id']
                        }
                    ]
                }
            ]
        }) as UserInstance[];

        const userCount = userList.length;

        let finalUserList = null;

        if (currentUserId !== null) {
            const targetUserIds = userList.map(user => user.User.id);

            const followings = await Follow.findAll({
                where: {
                    follow_user_id: currentUserId,
                    follower_user_id: targetUserIds
                }
            }) as FollowInstance[];

            const followingUserIdSet = new Set(followings.map(f => f.follower_user_id));

            finalUserList = userList.map(item => {
                const plainItem = item.toJSON();
                const targetId = plainItem.User?.id;
                plainItem.User.is_following = followingUserIdSet.has(targetId);
                return plainItem;
            });
        }

        if (!userList) {
            res.status(404).json({ error: 'データが見つかりません。' });
            return;
        }

        res.json({ userList: finalUserList ?? userList, userCount });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。'});
    }
});

router.get('/good-user-list/search/:id', authenticateOptional, async (req: Request, res: Response): Promise<void> => {
    type FollowInstance = InstanceType<typeof Follow>
    type UserInstance = InstanceType<typeof User>;

    try {
        const currentUserId = req.user?.id ?? null;

        const itemId = req.params.id;

        const userList = await GoodItem.findAll({
            where: { item_id: itemId },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'user_name', 'profile_image', 'verified'],
                    where: { user_name: { [Op.iLike]: `%${req.query.keyword}%` } },
                    include: [
                        {
                            model: ShopInfo,
                            attributes: ['id']
                        }
                    ]
                }
            ]
        }) as UserInstance[];

        const allUserList = await GoodItem.findAll({
            where: { item_id: itemId }
        });

        const userCount = allUserList.length;

        let finalUserList = null;

        if (currentUserId !== null) {
            const targetUserIds = userList.map(user => user.User.id);

            const followings = await Follow.findAll({
                where: {
                    follow_user_id: currentUserId,
                    follower_user_id: targetUserIds
                }
            }) as FollowInstance[];

            const followingUserIdSet = new Set(followings.map(f => f.follower_user_id));

            finalUserList = userList.map(item => {
                const plainItem = item.toJSON();
                const targetId = plainItem.User?.id;
                plainItem.User.is_following = followingUserIdSet.has(targetId);
                return plainItem;
            });
        }

        if (!userList) {
            res.status(404).json({ error: 'データが見つかりません。' });
            return;
        }

        res.json({ userList: finalUserList ?? userList, userCount });
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
                    attributes: ['id', 'name', 'price', 'sold_out'],
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
                        }
                    ]
                }
            ]
        });

        if (!itemList) {
            res.status(404).json({ error: 'アイテムが見つかりません。' });
            return;
        }

        res.json(itemList);
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
                    attributes: ['id', 'name', 'price', 'sold_out', [Sequelize.literal(`"Item"."image_url"[1]`), 'first_image_url']],
                    include: [
                        {
                            model: Sale,
                            attributes: ['discount_rate', 'discount_amount', 'sale_flag']
                        }
                    ]
                }
            ]
        });

        if (!itemList) {
            res.status(404).json({ error: 'アイテムが見つかりません。' });
            return;
        }

        res.json(itemList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。'});
    }
});

export default router;