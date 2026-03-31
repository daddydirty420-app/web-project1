import sequelize from "../../db.js";
import { AppError } from "../../errors.js";
import { Address, Delivery, Item, ItemShippingProfile, Name, TodouhukenOption, User } from "../../models/index.js";

type Params = {
    itemId: number;
    userId: number | null;
};

export const postDeliveryBuy = async ({ itemId, userId }: Params) => {

    // 自ユーザー情報取得
    const user = await User.findByPk(userId);
    if (!user) {
        throw new AppError("USER_NOTFOUND", 404);
    }

    // Item取得
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
        throw new AppError("ITEM_NOTFOUND", 404);
    }

    if (item.status !== "active") {
        throw new AppError("INVALID_ITEM", 400, "この商品は販売中ではないため購入できません");
    }

    // 住所・氏名取得
    const userAddress = await Address.findOne({
        where: { user_id: userId },
    });

    const userName = await Name.findOne({
        where: { user_id: userId },
    });

    let deliveryId = null;

    // データ作成
    await sequelize.transaction(async (t) => {
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

        await Address.create({
            delivery_id: newDelivery.id,
            post_number: userAddress?.post_number ?? null,
            todouhuken_id: userAddress?.todouhuken_id ?? null,
            shikutyouson: userAddress?.shikutyouson ?? null,
            banchi: userAddress?.banchi ?? null,
            building: userAddress?.building ?? null,
        }, { transaction: t });

        await Name.create({
            delivery_id: newDelivery.id,
            sei: userName?.sei,
            mei: userName?.mei,
            sei_kana: userName?.sei_kana,
            mei_kana: userName?.mei_kana,
        }, { transaction: t });

        deliveryId = newDelivery.id;
    });

    return deliveryId;
};