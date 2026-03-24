import { Categories, Follow, Item, Notification, User, Video } from "../../../models/index.js";
import { AppError } from "../../../errors.js";
import { Op } from "sequelize";
import { normalizeJapanese } from "../../../utils/normalizeJapanese.js";
import sequelize from "../../../db.js";

type Params = {
    itemId: number;
    userId: number;
};

export const patchPublish = async ({ itemId, userId }: Params) => {
    const nowDate = new Date();
        
    // getData
    const item = await Item.findByPk(itemId, {
        include: [
            { model: Video },
            {
                model: Categories,
                as: "Category",
                include: [
                    {
                        model: Categories,
                        as: "parent",
                        required: false,
                    },
                ],
            },
            { model: User },
        ],
    });
    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    // sort_number
    const followerCount = await Follow.count({
        where: { follower_user_id: userId },
    });

    const sellItemCount = await Item.count({
        where: {
            seller_id: userId,
            status: { [Op.in]: ["active", "soldout"] },
        },
    });

    let sort = (item.price / 10)
    + (item.detail?.length ?? 0)
    + (item.Video?.summary?.length ?? 0)
    + (item.User?.user_introduction?.length ?? 0)
    + (followerCount * 10)
    + (sellItemCount * 10);

    if (item.User?.penalty_points <= 5) {
        sort = sort + 5000;
    }
        
    // search_text      
    const searchText = `
    ${item.name}
    ${item.Video?.title ?? ""}
    ${item.Category?.name ?? ""}
    ${item.Category?.parent?.name ?? ""}
    ${item.User?.user_name ?? ""}
    `;
        
    const normalizeSearchText = normalizeJapanese(searchText ?? "");

    // データ更新
    await sequelize.transaction(async (t) => {
        await item.update({
            status: "active",
            uploaded_at: nowDate,
            save_at: nowDate,
            early_sell: true,
            sort_number: sort,
            sort_buzz_number: sort,
            search_text: normalizeSearchText,
        }, { transaction: t });
    
        await Notification.create({
            read_user_id: userId,
            url: `/item/${itemId}`,
            message_image: item.first_image_url,
            message: `商品「${item.name}」を出品いただき誠にありがとうございます。商品の詳細はこちらの商品ページからご確認ください。`,
        }, { transaction: t });
    });
};