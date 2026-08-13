import { Op } from "sequelize";
import { Item } from "../../../models/index.js";
import type { CronPerfectDeleteItemsParams } from "../../../types/serviceType/items.js";

export const getCronPerfectDeleteItems = ({ deletedBefore }: CronPerfectDeleteItemsParams) => {
    return Item.findAll({
        where: {
            status: "deleted",
            deleted_at: { [Op.lt]: deletedBefore },
        },
    });
};
