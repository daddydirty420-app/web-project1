import { Transaction } from "sequelize";
import { Transfer } from "../models/index.js";

type TransferIdParams = {
    id: string;
};

type CreateTransferParams = {
    data: {
        all_money: number;
        handling_charge: number;
        trans_money: number;
        trans_reason_id: number;
        user_id: number;
        trans_schedule_date: Date;
        transfer_id: string;
    };
    transaction?: Transaction;
};

export const getTransferIdExistingOne = ({ id }: TransferIdParams) => {
    return Transfer.findOne({
        where: { transfer_id: id },
    });
};

export const createTransfer = ({ data, transaction }: CreateTransferParams) => {
    return Transfer.create(data, { transaction });
};
