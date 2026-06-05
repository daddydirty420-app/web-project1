import { Op, Transaction } from "sequelize";
import sequelize from "../db.js";
import { Search } from "../models/index.js";

type UserIdParams = {
    userId: number;
};

type CreateSearchKeywordParams = {
    data: {
        search_text: string;
        user_id: number | null;
    };
    transaction?: Transaction;
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

export const createSearchKeyword = async ({ data, transaction }: CreateSearchKeywordParams) => {
    await Search.create(data, { transaction });
};
