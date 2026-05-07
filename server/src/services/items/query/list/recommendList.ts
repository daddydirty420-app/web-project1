import { Op } from "sequelize";
import { Categories, Item, Sale } from "../../../../models/index.js";
import { ItemPageRecommendParams, RecommendParams } from "../../../../types/serviceType/items.js";

export const getIndexRecommendItems = ({ where }: RecommendParams) => {
    return Item.findAll({
        attributes: ["id", "name", "price", "first_image_url"],
        where,
        limit: 20,
        order: [["sort_number", "DESC"]],
        include: [
            {
                model: Sale,
                attributes: ["discount_rate", "discount_amount", "sale_flag"],
            },
        ],
    });
};

export const getCartRecommendItems = ({ where }: RecommendParams) => {
    return Item.findAll({
        attributes: ["id", "name", "price", "first_image_url", "status"],
        where,
        limit: 20,
        order: [["sort_number", "DESC"]],
        include: [
            {
                model: Sale,
                attributes: ["discount_rate", "discount_amount", "sale_flag"],
            },
        ],
    });
};

export const getItemPageRecommendItems = ({ where, targetParentId, categoryRequired }: ItemPageRecommendParams) => {
    return Item.findAll({
        attributes: ["id", "name", "price", "first_image_url"],
        where,
        limit: 20,
        order: [["sort_number", "DESC"]],
        include: [
            {
                model: Sale,
                attributes: ["discount_rate", "discount_amount", "sale_flag"],
            },
            {
                model: Categories,
                as: "Category",
                where: {
                    [Op.or]: [{ parent_id: targetParentId }, { id: targetParentId }],
                },
                attributes: ["id"],
                required: categoryRequired,
            },
        ],
    });
};
