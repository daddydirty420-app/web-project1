import { Op } from "sequelize";
import { Item, Video } from "../../../../models/index.js";

type Params = {
    page: number;
    userId: number | null;
    keyword?: string;
};

export const getDeletedItems = async ({ page, userId, keyword }: Params) => {
    const limit = 20;
    const offset = (page - 1) * limit;

    const where: any = {
        seller_id: userId,
        status: "deleted",
    };

    if (keyword) {
        where.search_text = {
            [Op.iLike]: `%${keyword}%`,
        };
    }

    const itemList = await Item.findAll({
        attributes: ['id', 'name', 'price', "status", 'seller_id', 'save_at', 'first_image_url'],
        where,
        order: [["save_at", "DESC"]],
        limit,
        offset,
        include: [
            {
                model: Video,
                attributes: ['title'],
            },
        ],
    });

    const totalCount = await Item.count({ where });

    return {
        itemList,
        totalPages: Math.ceil(totalCount / limit),
    };
};