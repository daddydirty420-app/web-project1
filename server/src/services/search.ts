import { Op } from "sequelize";
import { Search } from "../models/index.js";
import sequelize from "../db.js";

type UserIdParams = {
    userId: number;
};

export const getSearchHistoryAll = ({ userId }: UserIdParams) => {
    return Search.findAll({
        attributes: [[sequelize.fn("MAX", sequelize.col("createdAt")), "createdAt"], "search_text"],
        where: {
            user_id: userId,
            search_text: {
                [Op.ne]: "",
                [Op.not]: null,
            },
        },
        group: ["search_text"],
        order: [[sequelize.literal('MAX("createdAt")'), "DESC"]],
    });
};
