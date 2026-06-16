import { Transfer } from "../models/index.js";
import {
    CreateTransferParams,
    DeleteTransferUserIdTransactionParams,
    TransferHistoryParams,
    TransferIdParams,
    TransIdParams,
    UserIdParams,
} from "../types/serviceType/transfer.js";

export const getTransferDetail = ({ id }: TransIdParams) => {
    return Transfer.findByPk(id, {
        attributes: [
            "id",
            "request_money",
            "handling_charge",
            "trans_money",
            "transfer_id",
            "createdAt",
            "bank_snapshot",
            "trans_finish",
            "trans_schedule_date",
            "trans_at",
        ],
    });
};

export const getTransferIdExistingOne = ({ transferId }: TransferIdParams) => {
    return Transfer.findOne({
        where: { transfer_id: transferId },
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
