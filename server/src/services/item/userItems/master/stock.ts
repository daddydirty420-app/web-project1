import { Op } from "sequelize";
import { Item, Sale, Video } from "../../../../models/index.js";

type Params = {
    page: number;
    userId: number | null;
    keyword?: string;
};

export const getStockListItems = async ({ page, userId, keyword }: Params) => {
    const limit = 20;
    const offset = (page - 1) * limit;

    const where: any = {
        seller_id: userId,
        status: { [Op.in]: ["active", "hidden", "soldout"] },
    };

    if (keyword) {
        where.search_text = {
            [Op.iLike]: `%${keyword}%`,
        };
    }

    const itemList = await Item.findAll({
        attributes: ['id', 'name', 'price', "status", 'seller_id', 'save_at', 'first_image_url', "attributes"],
        where,
        order: [["uploaded_at", "DESC"]],
        limit,
        offset,
        include: [
            {
                model: Video,
                attributes: ['title'],
            },
            {
                model: Sale,
                attributes: ['discount_rate', 'discount_amount', 'sale_flag', "before_price"],
            }
        ],
    });

    const totalCount = await Item.count({ where });

    return {
        itemList,
        totalPages: Math.ceil(totalCount / limit),
    };
};