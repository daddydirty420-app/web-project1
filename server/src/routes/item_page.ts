import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken, authenticateOptional } from "../middleware/index.js";
import { Item, User, ItemConditionOption, Cart, ItemLike, Video, Sale, Delivery, ShippingDayOption, ShippingServiceOption, TodouhukenOption, ShopInfo, WatchHistory, Address, Name, Comment, Notification, ItemDeleteLogs, ItemShippingProfile, Categories, Brands } from "../models/index.js";
import sequelize from "../db.js";

const router = Router();

router.post('/buy/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user!.id;
    const itemId = req.params.id;
    if (!itemId) {
        res.status(400).json({ message: 'itemIdがありません。' });
        return;
    }

    const t = await sequelize.transaction();

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            res.status(404).json({ message: "ユーザーが見つかりません。" });
            return;
        }
        
        const item = await Item.findByPk(itemId, {
            include: [
                { model: ItemShippingProfile },
                {
                    model: User,
                    include: [
                        {
                            model: Address,
                            required: false,
                            include: [
                                {
                                    model: TodouhukenOption,
                                    as: "AddressTodouhuken",
                                },
                            ],
                        },
                        {
                            model: Name,
                            required: false,
                        },
                    ],
                },
            ],
        });

        if (!item) {
            res.status(404).json({ message: '商品が見つかりません。' });
            return;
        }

        if (item.status !== "active") {
            res.status(404).json({ message: "この商品は販売中ではないため購入できません" });
            return;
        }

        const newDelivery = await Delivery.create({
            buyer_phone_number: user.phone_number ?? "",
            shipping_day_id: item.ItemShippingProfile.shipping_day_id,
            shipping_service_id: item.ItemShippingProfile.shipping_service_id,
            delivery_status_id: 1,
            shipping_place_id: item.ItemShippingProfile.shipping_place_id,
            item_id: itemId,
            shipping_from_name: `${item.User.Name?.sei ?? ""} ${item.User.Name?.mei ?? ""}`,
            shipping_from_postcode: item.User.Address?.post_number ?? "",
            shipping_from_prefecture: item.User.Address?.AddressTodouhuken?.name ?? "",
            shipping_from_address_line1: `${item.User.Address?.shikutyouson ?? ""} ${item.User.Address?.banchi ?? ""}`,
            shipping_from_address_line2: item.User.Address?.building ?? "",
            shipping_from_phone: item.User.phone_number ?? "",
        }, { transaction: t });

        const userAddress = await Address.findOne({
            where: { user_id: userId },
        });

        const newAddress = await Address.create({
            delivery_id: newDelivery.id,
        }, { transaction: t });

        if (userAddress) {
            await newAddress.update({
                post_number: userAddress.post_number,
                todouhuken_id: userAddress.todouhuken_id,
                shikutyouson: userAddress.shikutyouson,
                banchi: userAddress.banchi,
                building: userAddress.building ?? "",
            }, { transaction: t });
        }

        const userName = await Name.findOne({
            where: { user_id: userId },
        });

        const newName = await Name.create({
            delivery_id: newDelivery.id,
        }, { transaction: t });

        if (userName) {
            await newName.update({
                sei: userName.sei,
                mei: userName.mei,
                sei_kana: userName.sei_kana,
                mei_kana: userName.mei_kana,
            }, { transaction: t });
        }

        await t.commit();

        res.status(200).json({ deliveryId: newDelivery.id });
    } catch (err) {
        await t.rollback();
        next(err);
    }
});

export default router;