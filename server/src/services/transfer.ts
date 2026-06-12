import { Transfer } from "../models/index.js";
import {
    CreateTransferParams,
    DeleteTransferUserIdTransactionParams,
    TransferHistoryParams,
    TransferIdParams,
    UserIdParams,
} from "../types/serviceType/transfer.js";

export const getTransferIdExistingOne = ({ id }: TransferIdParams) => {
    return Transfer.findOne({
        where: { transfer_id: id },
    });
};

export const getTransferHistory = ({ where, limit }: TransferHistoryParams) => {
    return Transfer.findAll({
        attributes: ["id", "trans_money", "trans_finish", "createdAt"],
        where,
        order: [["createdAt", "DESC"]],
        limit,
    });
};

export const createTransfer = ({ data, transaction }: CreateTransferParams) => {
    return Transfer.create(data, { transaction });
};

export const deleteTransferUserLogical = async ({ userId, transaction }: DeleteTransferUserIdTransactionParams) => {
    await Transfer.destroy(
        {
            where: { user_id: userId },
        },
        { transaction },
    );
};

export const sumTransferNotFinishUser = ({ userId }: UserIdParams) => {
    return Transfer.sum("trans_money", {
        where: {
            user_id: userId,
            trans_finish: false,
        },
    });
};
