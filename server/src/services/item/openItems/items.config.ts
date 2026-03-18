import { Op } from "sequelize";
import { Sale, User, Video } from "../../../models/index.js";

export type ItemListView = 
| "index"
| "profile";

type Params = {
    userId: number | null;
    pageUserId?: number;
};

const viewBaseConfig = {
    index: {
        buildWhere: ({ userId }: Params) => {
            const where: any = { status: "active" };
            if (userId) {
                where.seller_id = { [Op.ne]: userId };
            }
            return where;
        },

        order: [["uploaded_at", "DESC"]],
    },

    profile: {
        buildWhere: ({ pageUserId }: Params) => {
            if (!pageUserId) throw new Error("INVALID_USERID");

            const where: any = {
                status: { [Op.in]: ["active", "soldout"] },
                seller_id: pageUserId,
            };

            return where;
        },

        order: [["uploaded_at", "DESC"]],
    },
}

export const viewVideosConfig = {
    index: {
        ...viewBaseConfig.index,

        attributes: ['id', 'name', 'price', 'status', 'uploaded_at', 'seller_id'],

        include: [
            {
                model: Sale,
                attributes: ['sale_flag', 'discount_rate', 'discount_amount'],
            },
        ],
    },

    profile: {
        ...viewBaseConfig.profile,

        attributes: ['id', 'name', 'price', "status", 'uploaded_at', 'seller_id'],

        include: [
            {
                model: Video,
                attributes: ['thumbnail_url', 'title', 'duration'],
            },
            {
                model: Sale,
                attributes: ['sale_flag', 'before_price', 'discount_rate', 'discount_amount'],
            },
        ],
    },
};

export const viewItemsConfig = {
    index: {
        ...viewBaseConfig.index,

        attributes: ['id', 'name', 'price', 'status', 'uploaded_at', 'seller_id', 'first_image_url'],

        include: [
            {
                model: Video,
                attributes: ['thumbnail_url', 'title', 'duration'],
            },
            {
                model: Sale,
                attributes: ['sale_flag', 'before_price', 'discount_rate', 'discount_amount'],
            },
            {
                model: User,
                attributes: ['user_name', 'profile_image'],
            },
        ],
    },

    profile: {
        ...viewBaseConfig.profile,

        attributes: ['id', 'name', 'price', "status", 'uploaded_at', 'seller_id', 'first_image_url'],
        
        include: [
            {
                model: Sale,
                attributes: ['sale_flag', 'discount_rate', 'discount_amount'],
            },
        ],
    },
};