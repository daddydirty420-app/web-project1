import { AppError } from "../../../errors.js";
import { Categories, Item, Sale } from "../../../models/index.js";
import { literal, Op } from "sequelize";

export type RecommendItemsview = 
| "recommend"
| "cart"
| "itemPage";

type Params = {
    userId: number | null;
    itemId?: number;
};

const baseConfig = {
    limit: 20,

    order: [['sort_number', 'DESC']],

    include: [
        {
            model: Sale,
            attributes: ['discount_rate', 'discount_amount', 'sale_flag'],
        },
    ],
};

export const recommendConfig = {
    recommend: {
        requireAuth: false,

        buildQuery: async ({ userId }: Params) => ({
            where: {
                status: "active",
                recommend: true,
                ...(userId && { seller_id: { [Op.ne]: userId } }),
            },
            attributes: ['id', 'name', 'price', 'first_image_url'],
            ...baseConfig,
        }),
    },

    cart: {
        requireAuth: true,

        buildQuery: async ({ userId }: Params) => ({
            where: {
                status: "active",
                seller_id: { [Op.ne]: userId },
                id: {
                    [Op.notIn]: literal(`(
                        SELECT "item_id"
                        FROM "cart"
                        WHERE "user_id" = ${userId}
                    )`)
                 },
            },
            attributes: ['id', 'name', 'price', 'first_image_url', "status"],
            ...baseConfig,
        }),
    },

    itemPage: {
        requireAuth: false,

        buildQuery: async ({ itemId, userId }: Params) => {
            const item = await Item.findByPk(itemId, {
                attributes: ["id", "seller_id", "category_id"],
                include: [
                    {
                        model: Categories,
                        as: "Category",
                    },
                ],
            });

            if (!item) throw new AppError("ITEM_NOT_FOUND", 404);

            const baseCategory = item.Category;

            const targetParentId = baseCategory.parent_id ?? baseCategory.id;

            const where: any = {
                id: { [Op.ne]: itemId },
                status: "active",
            };

            if (userId) {
                where.seller_id = userId === item.seller_id
                ? userId
                : { [Op.ne]: userId };
            }

            return {
                where,
                attributes: ['id', 'name', 'price', 'first_image_url'],
                ...baseConfig,
                include: [
                    ...baseConfig.include,
                    {
                        model: Categories,
                        as: "Category",
                        where: {
                            [Op.or]: [
                                { parent_id: targetParentId },
                                { id: targetParentId },
                            ],
                        },
                        attributes: ["id"],
                        required: true,
                    },
                ],
            };
        },
    },
};