import { ItemReport, ItemReportOption } from "../models/index.js";

type OptionIdParams = {
    optionId: number;
};

type CreateItemReportParams = {
    data: {
        item_id: number,
        report_user_id: number,
        option_id: number,
    };
};

export const getItemReportOption = ({ optionId }: OptionIdParams) => {
    return ItemReportOption.findByPk(optionId);
};

export const getAllItemReportOptions = () => {
    return ItemReportOption.findAll();
};

export const createItemReport = async ({ data }: CreateItemReportParams) => {
    await ItemReport.create(data);
};