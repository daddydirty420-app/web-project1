import { Op, Sequelize } from "sequelize";
import { Search } from "../models/index.js";

type UserIdParams = {
    userId: number;
};

export const getSearchHistoryAll = ({ userId }: UserIdParams) => {
    return Search.findAll({
        attributes: [[Sequelize.fn("MAX", Sequelize.col("createdAt")), "createdAt"], "search_text"],
        where: {
            user_id: userId,
            search_text: {
                [Op.ne]: "",
                [Op.not]: null,
            },
        },
        group: ["search_text"],
        order: [[Sequelize.literal('MAX("createdAt")'), "DESC"]],
    });
};
