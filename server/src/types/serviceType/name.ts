import { Transaction } from "sequelize";

export type UserIdParams = {
    userId: number;
};

export type CreateNameParams = {
    data: {
        user_id: number;
    };
    transaction?: Transaction;
};

export type CreateDeliveryNameParams = {
    data: {
        delivery_id: number;
        sei: string | null;
        mei: string | null;
        sei_kana: string | null;
        mei_kana: string | null;
    };
    transaction: Transaction;
};
