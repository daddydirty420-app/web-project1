import { Op } from "sequelize";
import { Item, Sale, Video, WatchHistory } from "../../../../models/index.js";

type Params = {
    page: number;
    userId: number | null;
    keyword?: string;
};

export const getWatchList = async ({ page, userId, keyword }: Params) => {
    const limit = 20;
    const offset = (page - 1) * limit;

    const itemWhere: any = {
        status: ["active", "soldout"]
    };

    if (keyword) {
        itemWhere.search_text = {
            [Op.iLike]: `%${keyword}%`,
        };
    }

    const watchList = await WatchHistory.findAll({
        attributes: ["id"],
        where: { user_id: userId },
        order: [["createdAt", "DESC"]],
        limit,
        offset,
        include: [
            {
                model: Item,
                where: itemWhere,
                attributes: ['id', 'name', 'price', "status", 'first_image_url', "gender_type", "age_type"],
                required: true,
                include: [
                    {
                        model: Sale,
                        attributes: ['discount_rate', 'discount_amount', 'sale_flag', "before_price"],
                        required: false,
                    },
                    {
                        model: Video,
                        attributes: ["title"],
                    },
                ],
            },
        ],
    });

    const itemList = watchList
    .map((watch: typeof WatchHistory) => watch.Item);

    const totalCount = await WatchHistory.count({
        where: { user_id: userId },
        include: [
            {
                model: Item,
                where: itemWhere,
                required: true,
            },
        ],
    });

    return {
        itemList,
        totalPages: Math.ceil(totalCount / limit),
    };
};