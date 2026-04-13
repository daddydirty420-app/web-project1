import { ItemReportOption } from "../models/index.js";

export const getItemReportOptions = () => {
    return ItemReportOption.findAll();
};