import { Op } from "sequelize";
import { Item } from "../../../models/index.js";
import type {
    CronPerfectDeleteItemsParams,
    GetItemsReportScoreCronParams,
    GetItemsSortDecayCronParams,
} from "../../../types/serviceType/items.js";

export const getItemsReportScoreCron = ({ minReportScore }: GetItemsReportScoreCronParams) => {
    return Item.findAll({
        where: {
            report_score: { [Op.gt]: minReportScore },
        },
    });
};

export const getItemsSortBuzzNumberDecayCron = ({ minSortNumber }: GetItemsSortDecayCronParams) => {
    return Item.findAll({
        where: {
            status: { [Op.in]: ["active", "hidden"] },
            sort_buzz_number: { [Op.gt]: minSortNumber },
        },
    });
};

export const getItemsSortNumberDecayCron = ({ minSortNumber }: GetItemsSortDecayCronParams) => {
    return Item.findAll({
        where: {
            status: { [Op.in]: ["active", "hidden"] },
            sort_number: { [Op.gt]: minSortNumber },
        },
    });
};

export const getCronPerfectDeleteItems = ({ deletedBefore }: CronPerfectDeleteItemsParams) => {
    return Item.findAll({
        where: {
            status: "deleted",
            deleted_at: { [Op.lt]: deletedBefore },
        },
    });
};
