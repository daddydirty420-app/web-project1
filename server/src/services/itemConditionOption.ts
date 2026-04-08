import { ItemConditionOption } from "../models/index.js";

type ConditionIdParams = {
    conditionId: number;
};

export const getItemCondition = async ({ conditionId }: ConditionIdParams) => {
    return ItemConditionOption.findByPk(conditionId);
};