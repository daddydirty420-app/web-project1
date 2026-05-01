export type OptionIdParams = {
    optionId: number;
};

export type ItemIdParams = {
    itemId: number;
};

export type CreateItemReportParams = {
    data: {
        item_id: number;
        report_user_id: number;
        option_id: number;
    };
};
