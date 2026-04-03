import { Op, Transaction } from "sequelize";
import { Address, Brands, Categories, Item, ItemConditionOption, ItemShippingProfile, Name, Sale, ShippingDayOption, ShippingServiceOption, ShopInfo, TodouhukenOption, User, Video } from "../models/index.js";
import { ItemIdParams, UserIdParams } from "../types/serviceType/items.js";

type ItemDataParams = {
    item: InstanceType<typeof Item>;
};

type ItemTransactionParams = {
    item: InstanceType<typeof Item>;
    transaction: Transaction;
};

type SortUpdateParams = {
    item: InstanceType<typeof Item>;
    data: {
        sort_number: number;
        sort_buzz_number: number;
    };
};

type CountUpdateParams = {
    item: InstanceType<typeof Item>;
    data: {
        views_count: number;
    };
};

type PublishUpdateParams = {
    item: InstanceType<typeof Item>;
    data: {
        sort_number: number;
        sort_buzz_number: number;
        search_text: string;
    };
    transaction: Transaction;
};

type LogicalDeleteParams = {
    item: InstanceType<typeof Item>;
    data: {
        price: number;
    };
    transaction: Transaction;
};

export const findByPkItem = async ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId);
};

export const getItemPageData = async ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId, {
        attributes: {
            exclude: ['sort_number', 'views_count', 'checked', 'createdAt', 'search_text'],
        },
        include: [
            { model: ItemConditionOption },
            {
                model: User,
                attributes: ['id', 'user_name', 'profile_image', 'early_seller', 'honnin_verified', 'star_amount', 'star_average'],
                include: [
                    {
                        model: ShopInfo,
                        attributes: ["id"],
                    },
                ],
            },
            {
                model: Video,
                attributes: ['id', 'thumbnail_url', 'title', 'summary', 'duration', 'play_count', 'original_url', 'converted_url'],
            },
            {
                model: Sale,
                attributes: ['id', 'before_price', 'discount_rate', 'discount_amount', 'sale_flag'],
            },
            {
                model: ItemShippingProfile,
                include: [
                    { model: ShippingDayOption },
                    { model: ShippingServiceOption },
                    { model: TodouhukenOption },
                ],
            },
            {
                model: Categories,
                as: "Category",
                include: [
                    {
                        model: Categories,
                        attributes: ["id", "name", "level", "parent_id", "allowed_gender", "allowed_age"],
                        as: "children",
                        required: false,
                    },
                    {
                        model: Categories,
                        attributes: ["id", "name", "level", "allowed_gender", "allowed_age"],
                        as: "parent",
                        required: false,
                    },
                ],
            },
            {
                model: Brands,
                as: "Brand",
                required: false,
            },
        ],
    });
};

export const getItemFormDataNormal = async ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId, {
        attributes: ["id", "seller_id", "status"],
        include: [
            {
                model: Video,
                attributes: ["id"],
            },
            {
                model: Sale,
                attributes: ["id"],
            },
            {
                model: ItemShippingProfile,
                attributes: ["id"],
            },
        ],
    });
};

export const getItemFormDataOther = async ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId, {
        attributes: ["id", "name", "detail", "image_url", "price", "seller_id", "gender_type", "age_type", "status", "attributes"],
        include: [
            {
                model: Video,
                attributes: ["id", "thumbnail_url", "title", "summary", "duration", "original_url", "converted_url"],
            },
            {
                model: Sale,
                attributes: ["id", "before_price"],
            },
            {
                model: ItemShippingProfile,
                attributes: ["id", "shipping_service_free_text"],
                include: [
                    { model: ShippingDayOption, required: false },
                    { model: ShippingServiceOption, required: false },
                    { model: TodouhukenOption, required: false },
                ],
            },
            {
                model: ItemConditionOption,
                required: false,
            },
            {
                model: Brands,
                as: "Brand",
                attributes: ["id", "name"],
                required: false,
            },
            {
                model: Categories,
                as: "Category",
                attributes: ["id", "name", "level", "parent_id"],
                required: false,
            },
        ],
    });
};

export const findByPkItemBuy = async ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId, {
        include: [
            { model: ItemShippingProfile },
            {
                model: User,
                include: [
                    {
                        model: Address,
                        required: false,
                        include: [
                            {
                                model: TodouhukenOption,
                                as: "AddressTodouhuken",
                            },
                        ],
                    },
                    {
                        model: Name,
                        required: false,
                    },
                ],
            },
        ],
    });
};

export const findByPkItemVideoSaleShipping = async ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId, {
        include: [
            { model: Video },
            { model: Sale },
            { model: ItemShippingProfile },
        ],
    });
};

export const findByPkItemVideoCategoriesUser = async ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId, {
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
};

export const getMetadata = async ({ itemId }: ItemIdParams) => {
    return Item.findByPk(itemId, {
        attributes: ["name", "price", "first_image_url"],
        include: [
            {
                model: Video,
                attributes: ["title", "summary"],
            },
        ],
    });
};

export const countSellItem = async ({ userId }: UserIdParams) => {
    return Item.count({
        where: {
            seller_id: userId,
            status: { [Op.in]: ["active", "soldout"] },
        },
    });
};

export const updateSortNumber = async ({ item, data }: SortUpdateParams) => {
    await item.update(data);
};

export const addViewsCount = async ({ item, data }: CountUpdateParams) => {
    await item.update(data);
};

export const updateRestoreItem = async ({ item, transaction }: ItemTransactionParams) => {
    const nowDate = new Date();

    await item.update({
        uploaded_at: nowDate,
        status: "active",
        deleted_at: null,
    }, { transaction });
};

export const updatePublishItem = async ({ item, data, transaction }: PublishUpdateParams) => {
    const nowDate = new Date();

    await item.update({
        status: "active",
        uploaded_at: nowDate,
        save_at: nowDate,
        early_sell: true,
        ...data,
    }, { transaction });
};

export const updateLogicalDeleteItem = async ({ item, data, transaction }: LogicalDeleteParams) => {
    const nowDate = new Date();

    await item.update({
        uploaded_at: null,
        sort_number: 0,
        sort_buzz_number: 0,
        status: "deleted",
        deleted_at: nowDate,
        ...data,
    }, { transaction });
};

export const destroyDraftItem = async ({ item }: ItemDataParams) => {
    await item.destroy();
};

export const destroyPerfectItem = async ({ item, transaction }: ItemTransactionParams) => {
    await item.destroy({ transaction });
};