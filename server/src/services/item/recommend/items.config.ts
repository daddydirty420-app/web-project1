import { Cart, Item, Sale } from "../../../models/index.js";
import { Op } from "sequelize";

export type ReccomendItemsview = 
| "reccomend"
| "cart";

type Params = {
    userId: number | null;
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
    reccomend: {
        requireAuth: false,

        buildWhere: ({ userId }: Params) => {
            const where: any = {
                status: "active",
                recommend: true,
            };

            if (userId) {
                where.seller_id = { [Op.ne]: userId };
            }

            return where;
        },

        attributes: ['id', 'name', 'price', 'first_image_url'],

        limit: baseConfig.limit,

        order: baseConfig.order,

        include: baseConfig.include,
    },

    cart: {
        requireAuth: true,

        buildWhere: async ({ userId }: Params) => {
            const cartList = await Cart.findAll({
                where: { user_id: userId },
                include: [
                    {
                        model: Item,
                        where: { status: "active" },
                        required: true,
                    },
                ],
            });

            const cartItemIds = cartList.map((cart: typeof Cart) => cart.Item?.id);

            const where: any = {
                status: "active",
                seller_id: { [Op.ne]: userId },
                id: { [Op.notIn]: cartItemIds },
            };

            return where;
        },

        attributes: ['id', 'name', 'price', 'first_image_url', "status"],

        limit: baseConfig.limit,

        order: baseConfig.order,

        include: baseConfig.include,
    },
};