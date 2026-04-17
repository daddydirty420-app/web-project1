import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express-serve-static-core';
import { Op, fn, col, literal } from 'sequelize';
import { authenticateToken, isAdmin } from '../../middleware/index.js';
import {
    User,
    Item,
    ShopInfo,
    GenderOption,
    Address,
    Name,
    TodouhukenOption,
    IdCard,
    UriagekinHistory,
    Journal,
    Notification,
} from '../../models/index.js';
import deleteUser from '../../services/old/deleteUser.js';
import sequelize from '../../db.js';

const router = Router();

router.delete(
    '/delete-user/:id',
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const currentUserId = req.params.id;
        const numUserId = Number(currentUserId);
        const adminId = req.user!.id;

        const { deleteReason } = req.body;
        if (!deleteReason) {
            res.status(400).json({ message: '削除理由を入力してください。' });
            return;
        }

        try {
            await deleteUser(numUserId, adminId, deleteReason);

            res.status(200).json({ message: 'ユーザーを削除しました。' });
        } catch (err) {
            next(err);
        }
    },
);

router.patch(
    '/add-penalty/:id',
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const { addPenalty } = req.body;
        if (!addPenalty) {
            res.status(400).json({ message: 'ペナルティポイントを入力してください。' });
            return;
        }

        const addPenaltyNum = Number(addPenalty);
        if (isNaN(addPenaltyNum)) {
            res.status(400).json({ message: 'ペナルティポイントは数値で入力してください。' });
            return;
        }
        if (addPenaltyNum <= 0) {
            res.status(400).json({ message: 'マイナスまたは0は無効です。' });
            return;
        }

        try {
            const user = await User.findByPk(req.params.id);
            if (!user) {
                res.status(404).json({ message: 'ユーザーが見つかりません。' });
                return;
            }

            user.penalty_points += addPenaltyNum;

            await user.save();

            res.status(200).json({ message: 'ペナルティポイントを追加しました。' });
        } catch (err) {
            next(err);
        }
    },
);

router.patch(
    '/delete-uriage/:id',
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const currentUserId = req.params.id;

        const { deleteUriage } = req.body;
        if (!deleteUriage) {
            res.status(400).json({ message: '没収金額を入力してください。' });
            return;
        }

        const deleteUriageNum = Number(deleteUriage);
        if (isNaN(deleteUriageNum)) {
            res.status(400).json({ message: '没収金額は数値で入力してください。' });
            return;
        }
        if (deleteUriageNum <= 0) {
            res.status(400).json({ message: 'マイナスまたは0は無効です。' });
            return;
        }

        const t = await sequelize.transaction();

        try {
            const user = await User.findByPk(currentUserId);
            if (!user) {
                res.status(404).json({ message: 'ユーザーが見つかりません。' });
                return;
            }

            if (user.uriagekin < deleteUriageNum) {
                res.status(400).json({ message: '没収額が売上金残高を超えています。' });
                return;
            }

            const cutoffDate = new Date();

            cutoffDate.setDate(cutoffDate.getDate() - 180);

            let remaining = deleteUriageNum;

            const histories = await UriagekinHistory.findAll({
                where: {
                    user_id: currentUserId,
                    createdAt: { [Op.gte]: cutoffDate },
                },
                order: [['createdAt', 'ASC']],
            });

            for (const history of histories) {
                if (remaining <= 0) break;

                const available = history.uriagekin - (history.used_uriagekin || 0);
                if (available > 0) {
                    const deduction = Math.min(available, remaining);
                    history.used_uriagekin = (history.used_uriagekin || 0) + deduction;
                    remaining -= deduction;
                    await history.save({ transaction: t });
                }
            }

            user.uriagekin -= deleteUriageNum;

            await user.save({ transaction: t });

            await Notification.create(
                {
                    read_user_id: currentUserId,
                    message: `重大な規約違反が確認されたため、売上金${deleteUriageNum.toLocaleString()}円を回収いたしました。利用規約に沿ったご利用をお願いします。`,
                },
                { transaction: t },
            );

            await Journal.create(
                {
                    kanjyo_kari1: 3,
                    kanjyo_kashi1: 6,
                    price_kari1: deleteUriageNum,
                    price_kashi1: deleteUriageNum,
                    reason_id: 8,
                },
                { transaction: t },
            );

            // メール送信処理

            await t.commit();

            res.status(200).json({
                message: '売上金没収処理が完了しました',
                deleteUriageNum,
            });
        } catch (err) {
            await t.rollback();
            next(err);
        }
    },
);

router.get(
    '/verify',
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userList = await User.findAll({
                attributes: ['id', 'user_name', 'birthday', 'phone_number', 'verify_request', 'verified', 'email'],
                where: {
                    verify_request: true,
                    verified: false,
                },
                order: [['updatedAt', 'ASC']],
                include: [
                    {
                        model: Address,
                        attributes: ['id', 'post_number', 'shikutyouson', 'banchi', 'building'],
                        include: [
                            {
                                model: TodouhukenOption,
                                as: 'AddressTodouhuken',
                            },
                        ],
                    },
                    {
                        model: Name,
                        attributes: ['id', 'sei', 'mei', 'sei_kana', 'mei_kana'],
                    },
                    { model: GenderOption },
                    {
                        model: IdCard,
                        attributes: ['id', 'id_card_front', 'id_card_rear'],
                    },
                ],
            });

            const userCount = userList.length;

            res.json({
                userList,
                userCount,
            });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    '/penalty-list',
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userList = await User.findAll({
                attributes: ['id', 'user_name', 'profile_image', 'email', 'penalty_points', 'verified'],
                order: [
                    ['penalty_points', 'DESC'],
                    ['createdAt', 'ASC'],
                ],
                limit: 30,
                include: [
                    {
                        model: ShopInfo,
                        attributes: ['id'],
                    },
                ],
            });

            res.json({ userList });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    '/penalty-search-list',
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const keyword = req.body.keyword;

            const userList = await User.findAll({
                attributes: ['id', 'user_name', 'profile_image', 'email', 'penalty_points', 'verified'],
                where: {
                    user_name: { [Op.iLike]: `%${keyword}%` },
                },
                order: [
                    ['penalty_points', 'DESC'],
                    ['createdAt', 'ASC'],
                ],
                include: [
                    {
                        model: ShopInfo,
                        attributes: ['id'],
                    },
                ],
            });

            res.json({ userList });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    '/points-give-list',
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userList = await User.findAll({
                attributes: [
                    'id',
                    'user_name',
                    'email',
                    'campaign_points_sum',
                    [fn('COUNT', col('Items.id')), 'item_count'],
                ],
                include: [
                    {
                        model: Item,
                        attributes: ['id'],
                        required: true,
                    },
                ],
                group: ['User.id'],
                order: [
                    [literal('item_count'), 'DESC'],
                    ['createdAt', 'ASC'],
                ],
            });

            const campaignPointsSum = userList.reduce((sum: number, user: InstanceType<typeof User>) => {
                return sum + (user.campaign_points_sum || 0);
            }, 0);

            res.json({
                userList,
                campaignPointsSum,
            });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    '/profile/:id',
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await User.findByPk(req.params.id, {
                attributes: ['penalty_points', 'uriagekin'],
            });

            if (!user) {
                res.status(404).json({ message: 'ユーザーが見つかりません。' });
                return;
            }

            res.json({ user });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    '/search-user-all',
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userList = await User.findAll({
                attributes: ['id', 'user_name', 'email', 'profile_image', 'verified', 'early_seller', 'createdAt'],
                order: [['createdAt', 'DESC']],
                limit: 30,
                include: [
                    {
                        model: ShopInfo,
                        attributes: ['id'],
                    },
                ],
            });

            res.json({ userList });
        } catch (err) {
            next(err);
        }
    },
);

router.get(
    '/search-user',
    authenticateToken,
    isAdmin,
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const keyword = req.query.keyword;

        try {
            const userList = await User.findAll({
                attributes: ['id', 'user_name', 'email', 'profile_image', 'verified', 'early_seller', 'createdAt'],
                where: {
                    user_name: { [Op.iLike]: `%${keyword}%` },
                },
                order: [['createdAt', 'DESC']],
                limit: 30,
                include: [
                    {
                        model: ShopInfo,
                        attributes: ['id'],
                    },
                ],
            });

            res.json({ userList });
        } catch (err) {
            next(err);
        }
    },
);

export default router;
