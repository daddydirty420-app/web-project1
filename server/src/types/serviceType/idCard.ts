import { Transaction } from "sequelize";
import { IdCard } from "../../models/index.js";

export type CreateIdParams = {
    data: {
        user_id: number;
    };
    transaction?: Transaction;
};

export type CreateIdUrlParams = {
    data: {
        user_id: number;
        id_card_front: string;
        id_card_rear: string;
    };
    transaction?: Transaction;
};

export type UpdateIdParams = {
    idCard: InstanceType<typeof IdCard>;
    data: {
        id_card_front: string;
        id_card_rear: string;
    };
    transaction?: Transaction;
};

export type IdCardTransactionParams = {
    idCard: InstanceType<typeof IdCard>;
    transaction?: Transaction;
};
