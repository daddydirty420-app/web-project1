import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { Op } from "sequelize";
import sequelize from "../db.js";
import { authenticateToken } from "../middleware/index.js";
import { Address, BankAccount, Name, ShopInfo } from "../models/index.js";

const router = Router();

router.patch("/edit/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const shopId = req.params.id;
    const updateData = req.body;

    try {
        await ShopInfo.update(updateData, {
            where: {
                id: shopId,
            },
        });

        res.status(200).json({ message: "更新しました。", updated: updateData });
    } catch (err) {
        next(err);
    }
});

router.patch("/5/:id", authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const shopId = req.params.id;
    const userId = req.user!.id;

    const t = await sequelize.transaction();

    try {
        const oldShops = await ShopInfo.findAll({
            where: {
                id: { [Op.ne]: shopId },
                verified: false,
                user_id: userId,
            },
            include: [{ model: Address }, { model: Name }, { model: BankAccount }],
        });

        if (oldShops.length > 0) {
            for (const oldShop of oldShops) {
                if (oldShop.Address) {
                    await oldShop.Address.destroy({ transaction: t });
                }

                if (oldShop.Name) {
                    await oldShop.Name.destroy({ transaction: t });
                }

                if (oldShop.BankAccount) {
                    await oldShop.BankAccount.destroy({ transaction: t });
                }

                await oldShop.destroy({ transaction: t });
            }
        }

        const shop = await ShopInfo.findByPk(shopId);

        if (!shop) {
            res.status(404).json({ message: "ショップデータが見つかりません。" });
            return;
        }

        await shop.update(
            {
                request_all: true,
            },
            { transaction: t },
        );

        // メール送信処理

        await t.commit();

        res.status(200).json({ message: "ショップ登録のリクエストが完了しました！" });
    } catch (err) {
        await t.rollback();
        next(err);
    }
});

export default router;
