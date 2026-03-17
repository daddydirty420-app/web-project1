import { Op } from "sequelize";
import { Item, Sale, Video } from "../../../../models/index.js";

type Params = {
    page: number;
    userId: number | null;
    statusList?: string[];
    keyword?: string;
};

export const getUploadedItems = async ({ page, userId, statusList, keyword }: Params) => {
    const limit = 20;
    const offset = (page - 1) * limit;

    const where: any = {
        seller_id: userId,
    };

    // status分岐
    if (statusList && statusList.length > 0) {
        where.status = { [Op.in]: statusList };
    } else {
        // デフォルト
        where.status = { [Op.in]: ["active", "hidden", "soldout"] };
    }

    // keyword
    if (keyword) {
        where.search_text = {
            [Op.iLike]: `%${keyword}%`,
        };
    }

    const itemList = await Item.findAll({
        attributes: ['id', 'name', 'price', "status", "seller_id", 'first_image_url', "gender_type", "age_type"],
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