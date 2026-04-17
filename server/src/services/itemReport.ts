import { ItemReport, ItemReportOption } from "../models/index.js";
import { CreateItemReportParams, OptionIdParams } from "../types/serviceType/itemReport.js";

export const getItemReportOption = ({ optionId }: OptionIdParams) => {
    return ItemReportOption.findByPk(optionId);
};

export const getAllItemReportOptions = () => {
    return ItemReportOption.findAll();
};

export const createItemReport = async ({ data }: CreateItemReportParams) => {
    await ItemReport.create(data);
};
