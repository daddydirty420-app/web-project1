import { ItemConditionOption } from '../models/index.js';

export const findAllCondition = async () => {
    return ItemConditionOption.findAll();
};
