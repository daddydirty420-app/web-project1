import { Op } from "sequelize";
import { Cart, Item, Sale, Video } from "../../../../models/index.js";

type Params = {
    page: number;
    userId: number | null;
    keyword?: string;
};

export const getCartList = async ({ page, userId, keyword }: Params) => {
    const limit = 20;
    const offset = (page - 1) * limit;

    const itemWhere: any = {
        status: "active"
    };

    if (keyword) {
        itemWhere.search_text = {
            [Op.iLike]: `%${keyword}%`,
        };
    }

    const cartList = await Cart.findAll({
        attributes: ["id"],
        where: { user_id: userId },
        order: [["createAt", "DESC"]],
        limit,
        offset,
        include: [
            {
                model: Item,
                where: itemWhere,
                attributes: ['id', 'name', 'price', "status", 'seller_id', 'first_image_url', "gender_type", "age_type"],
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

    const itemList = cartList
    .map((cart: typeof Cart) => cart.Item);

    const totalCount = await Cart.count({
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