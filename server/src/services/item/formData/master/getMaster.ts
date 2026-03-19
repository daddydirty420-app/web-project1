import { Categories, ItemConditionOption, ShippingDayOption, ShippingServiceOption, ShopInfo, TodouhukenOption, User } from "../../../../models/index.js";

export const getCategories = async () => {
    const category = await Categories.findAll({
        where: { level: 1 },
        order: [["sort_number", "ASC"]],
    });

    return category;
};

export const getConditions = async () => {
    const allCondition = await ItemConditionOption.findAll({
        order: [["id", "ASC"]],
    });
    
    return allCondition;
};

export const getShippingDays = async () => {
    const allDay = await ShippingDayOption.findAll({
        order: [["id", "ASC"]],
    });

    return allDay;
};

export const getShippingServices = async () => {
    const allService = await ShippingServiceOption.findAll({
        order: [["id", "ASC"]],
    });

    return allService;
};

export const getPlaces = async () => {
    const allPlace = await TodouhukenOption.findAll({
        order: [["id", "ASC"]],
    });

    return allPlace;
};

export const checkHasShop = async (userId: number) => {
    const user = await User.findByPk(userId, {
        attributes: ["id"],
        include: [
            {
                model: ShopInfo,
                required: false,
            },
        ],
    });

    const hasShop = !!user.ShopInfo;

    return hasShop;
};