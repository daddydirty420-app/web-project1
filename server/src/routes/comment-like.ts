import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import { authenticateOptional, authenticateToken } from "../middleware/index.js";
import { CommentLike, User, Follow, ShopInfo, Comment } from "../models/index.js";

const router = Router();

router.post("/add/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user!.id;
    const commentId = req.params.id;

    try {
        const data = await CommentLike.findOne({
            where: {
                user_id: currentUserId,
                comment_id: commentId,
            },
        });
        if (data) {
            res.status(409).json({ message: "すでにいいね済みです。" });
            return;
        }

        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            res.status(404).json({ message: "コメントが見つかりません。" });
            return;
        }

        await CommentLike.create({
            user_id: currentUserId,
            comment_id: commentId,
        });

        comment.sort_number = Number(comment.sort_number) + 100;
        await comment.save();

        res.status(200).json({ isGood: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.delete("/remove/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const currentUserId = req.user!.id;
    const commentId = req.params.id;

    try {
        const data = await CommentLike.findOne({
            where: {
                user_id: currentUserId,
                comment_id: commentId,
            },
        });
        if (!data) {
            res.status(409).json({ message: "いいねしていません。" });
            return;
        }

        const comment = await Comment.findByPk(commentId);
        if (!comment) {
            res.status(404).json({ message: "コメントが見つかりません。" });
            return;
        }

        await data.destroy();

        if (comment.sort_number > 0) {
            const sortNumber = Number(comment.sort_number);
            const newSort = sortNumber - Math.min(100, sortNumber);
            comment.sort_number = newSort;
            await comment.save();
        }

        res.status(200).json({ isGood: false });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get("/status/:id", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const isGood = await CommentLike.findOne({
            where: {
                user_id: req.user!.id,
                comment_id: req.params.id,
            },
        });


        res.status(200).json({ isGood: !!isGood });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get("/count/:id", async (req: Request, res: Response): Promise<void> => {
    try {
        const count = await CommentLike.count({
            where: { comment_id: req.params.id },
        });

        res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get('/like-user-list/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    type FollowInstance = InstanceType<typeof Follow>
    type UserInstance = InstanceType<typeof User>;
        
    const currentUserId = req.user!.id;
    const commentId = req.params.id;

    try {
        const commentLikeList = await CommentLike.findAll({
            attributes: ["id"],
            where: { comment_id: commentId },
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
            const targetUserIds = commentLikeList.map(user => user.User.id);

            const followings = await Follow.findAll({
                where: {
                    follow_user_id: currentUserId,
                    follower_user_id: targetUserIds
                }
            }) as FollowInstance[];

            const followingUserIdSet = new Set(followings.map(f => f.follower_user_id));

            finalGoodList = commentLikeList.map(item => {
                const plainItem = item.toJSON();
                const targetId = plainItem.User?.id;
                plainItem.User.is_following = followingUserIdSet.has(targetId);
                return plainItem;
            });
        }

        const source = finalGoodList ?? commentLikeList;

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

router.get('/like-user-list/search/:id', authenticateOptional, async (req: Request, res: Response): Promise<void> => {
    type FollowInstance = InstanceType<typeof Follow>
    type UserInstance = InstanceType<typeof User>;
        
    const currentUserId = req.user!.id;
    const commentId = req.params.id;
    const keyword = req.query?.keyword ?? "";
    if (!String(keyword).trim()) {
        res.status(400).json({ message: "検索キーワードがありません" });
        return;
    }

    try {
        const commentLikeList = await CommentLike.findAll({
            attributes: ["id"],
            where: { comment_id: commentId },
            order: [['createdAt', 'DESC']],
            distinct: true,
            include: [
                {
                    model: User,
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
        }) as UserInstance[];

        let finalGoodList = null;

        if (currentUserId !== null) {
            const targetUserIds = commentLikeList.map(user => user.User.id);

            const followings = await Follow.findAll({
                where: {
                    follow_user_id: currentUserId,
                    follower_user_id: targetUserIds
                }
            }) as FollowInstance[];

            const followingUserIdSet = new Set(followings.map(f => f.follower_user_id));

            finalGoodList = commentLikeList.map(item => {
                const plainItem = item.toJSON();
                const targetId = plainItem.User?.id;
                plainItem.User.is_following = followingUserIdSet.has(targetId);
                return plainItem;
            });
        }

        const source = finalGoodList ?? commentLikeList;

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

export default router;