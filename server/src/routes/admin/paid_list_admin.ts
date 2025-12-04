import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken, isAdmin } from "../../middleware/index.js";
import { Op } from "sequelize";
import { PaidInfo, Item, Delivery, DeliveryStatusOption, User } from "../../models/index.js";
import { subDays } from "date-fns";

const router = Router();

router.get('/30', authenticateToken, isAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        const thirtyDaysAgo = subDays(new Date(), 30);

        const dataList = await PaidInfo.findAll({
            attributes: ['id', 'gain_amount', 'buy_date'],
            where: {
                cancel: false,
                buy_date: {
                    [Op.lt]: thirtyDaysAgo
                }
            },
            order: [['buy_date', 'ASC']],
            include: [
                {
                    model: Item,
                    attributes: ['id', 'name']
                },
                {
                    model: User,
                    as: 'Seller',
                    attributes: ['id', 'user_name', 'email']
                },
                {
                    model: User,
                    as: 'Buyer',
                    attributes: ['id', 'user_name', 'email']
                },
                {
                    model: Delivery,
                    required: true,
                    attributes: ['id'],
                    include: [
                        {
                            model: DeliveryStatusOption,
                            where: {
                                id: {
                                    [Op.ne]: 4
                                }
                            },
                            required: true,
                            attributes: ['id', 'name']
                        }
                    ]
                }
            ]
        });

        if (!dataList) {
            res.status(404).json({ error: 'データが見つかりません。' });
            return;
        }

        res.json(dataList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;