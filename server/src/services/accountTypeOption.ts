import { AccountTypeOption } from "../models/index.js";

type AccountTypeParams = {
    accountType: string;
};

export const getAccountTypeOne = ({ accountType }: AccountTypeParams) => {
    return AccountTypeOption.findOne({
        where: { name: accountType },
    });
};
