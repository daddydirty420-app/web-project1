import { Router, Request, Response } from "express";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { Op, fn, WhereOptions, literal } from "sequelize";
import { ShopInfo, User, ComOrFreeOption, Address, Name, TodouhukenOption, BankAccount, AccountTypeOption, UriagekinHistory } from "../../models/index.js";
import { subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";

const router = Router();

router.get('/list', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const keyword = req.query?.keyword ?? null;

        const base = { verified: true };

        const whereCondition: WhereOptions = keyword
        ? ({
            [Op.and]: [
                base,
                {
                    [Op.or]: [
                        { conpany_name: { [Op.iLike]: `%${keyword}%`} },
                        { shop_name: { [Op.iLike]: `%${keyword}%`} },
                    ]
                }
            ]
        } as WhereOptions)
        : (base as WhereOptions);

        const dataList = await ShopInfo.findAll({
            attributes: ['id', 'company_name', 'shop_name'],
            where: whereCondition,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: ComOrFreeOption,
                    attributes: ['id', 'name']
                },
                {
                    model: Address,
                    attributes: ['id', 'post_number', 'shikutyouson', 'banchi', 'building'],
                    include: [
                        {
                            model: TodouhukenOption,
                            as: 'AddressTodouhuken',
                            attributes: ['id', 'name']
                        }
                    ]
                },
                {
                    model: Name,
                    attributes: ['id', 'sei', 'mei', 'sei_kana', 'mei_kana', 'middle_name', 'middle_name_kana']
                }
            ]
        });

        if (!dataList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json(dataList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/signup-list', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const dataList = await ShopInfo.findAll({
            attributes: ['id', 'company_name', 'id_card_front', 'id_card_rear'],
            where: {
                request_all: true,
                verified: false
            },
            order: [['createdAt', 'ASC']],
            include: [
                {
                    model: ComOrFreeOption,
                    attributes: ['id', 'name']
                },
                {
                    model: Address,
                    attributes: ['id', 'post_number', 'shikutyouson', 'banchi', 'building'],
                    include: [
                        {
                            model: TodouhukenOption,
                            as: 'AddressTodouhuken',
                            attributes: ['id', 'name']
                        }
                    ]
                },
                {
                    model: Name,
                    attributes: ['id', 'sei', 'mei', 'sei_kana', 'mei_kana', 'middle_name', 'middle_name_kana']
                }
            ]
        });

        if (!dataList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        const shopCount = dataList.length || 0;
        const twoDaysAgo = subDays(new Date(), 2);
        const shopCount2d = await ShopInfo.count({
            where: {
                request_all: true,
                verified: false,
                createdAt: {
                    [Op.lte]: twoDaysAgo
                }
            }
        });

        res.json({
            dataList,
            shopCount,
            shopCount2d
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/trans-auto-make', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const startOfLastMonth = startOfMonth(subMonths(new Date(), 1));
        const endOfLastMonth = endOfMonth(subMonths(new Date(), 1));

        const dataList = await ShopInfo.findAll({
            attributes: ['id', 'company_name', 'shop_name'],
            where: { auto_trans: true },
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: BankAccount,
                    attributes: ['id']
                },
                {
                    model: User,
                    attributes: ['id', 'user_name', 'email', [fn('COALESCE', fn('SUM', literal('"User->UriagekinHistories"."uriagekin" - "User->UriagekinHistories"."uriagekin_used"')), 0), 'monthly_uriagekin']],
                    include: [
                        {
                            model: UriagekinHistory,
                            attributes: ['id'],
                            where: {
                                createdAt: {
                                    [Op.between]: [startOfLastMonth, endOfLastMonth]
                                }
                            },
                            required: false
                        }
                    ]
                }
            ],
            group: [
                'ShopInfo.id',
                'BankAccount.id',
                'User.id'
            ],
            subQuery: false
        });

        if (!dataList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        const dataCount = dataList.length || 0;
        const uriagekinAmount = dataList.reduce((sum: number, data: any) => {
            const monthly = Number(data.User?.get?.("monthly_uriagekin") ?? 0);
            return sum + monthly;
        }, 0);

        res.json({
            dataList,
            dataCount,
            uriagekinAmount
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/:id', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const dataList = await ShopInfo.findByPk(req.params.id, {
            include: [
                {
                    model: ComOrFreeOption,
                    attributes: ['id', 'name']
                },
                {
                    model: Address,
                    attributes: ['id', 'post_number', 'shikutyouson', 'banchi', 'building'],
                    include: [
                        {
                            model: TodouhukenOption,
                            as: 'AddressTodouhuken',
                            attributes: ['id', 'name']
                        }
                    ]
                },
                {
                    model: Name,
                    attributes: ['id', 'sei', 'mei', 'sei_kana', 'mei_kana', 'middle_name', 'middle_name_kana']
                },
                {
                    model: BankAccount,
                    attributes: ['id', 'bank_name', 'branch_code', 'account_number', 'meigi'],
                    include: [
                        {
                            model: AccountTypeOption,
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });

        if (!dataList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json(dataList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;