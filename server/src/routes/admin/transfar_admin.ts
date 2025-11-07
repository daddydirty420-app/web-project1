import { Router, Request, Response } from "express";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { Transfar, TransReasonOption, User, BankAccount, AccountTypeOption } from "../../models/index.js";

const router = Router();

router.get('/180', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const dataList = await Transfar.findAll({
            attributes: ['id', 'trans_money', 'trans_finish'],
            where: {
                trans_finish: false,
                trans_reason_id: 3
            },
            order: [['createdAt', 'ASC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'user_name', 'email']
                },
                {
                    model: TransReasonOption,
                    attributes: ['id', 'name']
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

router.get('/archive', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const dataList = await Transfar.findAll({
            attributes: ['id', 'trans_money', 'trans_finish', 'trans_date'],
            where: { trans_finish: true },
            order: [['trans_date', 'DESC']],
            limit: 100,
            include: [
                {
                    model: User,
                    attributes: ['id', 'user_name', 'email']
                },
                {
                    model: TransReasonOption,
                    attributes: ['id', 'name']
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

router.get('/auto', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const dataList = await Transfar.findAll({
            attributes: ['id', 'trans_money', 'trans_finish'],
            where: {
                trans_finish: false,
                trans_reason_id: 4
            },
            order: [['createdAt', 'ASC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'user_name', 'email']
                },
                {
                    model: TransReasonOption,
                    attributes: ['id', 'name']
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

router.get('/cancel', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const dataList = await Transfar.findAll({
            attributes: ['id', 'trans_money', 'trans_finish', 'createdAt'],
            where: {
                trans_finish: false,
                trans_reason_id: 2
            },
            order: [['createdAt', 'ASC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'user_name', 'email']
                },
                {
                    model: TransReasonOption,
                    attributes: ['id', 'name']
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

router.get('/normal', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const dataList = await Transfar.findAll({
            attributes: ['id', 'trans_money', 'trans_finish', 'createdAt'],
            where: {
                trans_finish: false,
                trans_reason_id: 1
            },
            order: [['createdAt', 'ASC']],
            include: [
                {
                    model: User,
                    attributes: ['id', 'user_name', 'email']
                },
                {
                    model: TransReasonOption,
                    attributes: ['id', 'name']
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