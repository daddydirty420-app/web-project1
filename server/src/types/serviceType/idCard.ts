import { Transaction } from "sequelize";
import { IdCard } from "../../models/index.js";

export type CreateIdFirstParams = {
    transaction?: Transaction;
};

export type CreateIdParams = {
    data: {
        front_s3_metadata_id: number;
        rear_s3_metadata_id: number;
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
