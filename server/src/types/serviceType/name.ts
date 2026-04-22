import { Transaction } from "sequelize";
import { Name } from "../../models/index.js";

export type UserIdParams = {
    userId: number;
};

export type NameIdParams = {
    nameId: number;
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
    transaction?: Transaction;
};

export type UpdateNameParams = {
    name: InstanceType<typeof Name>;
    data: {
        sei: string;
        mei: string;
        sei_kana: string;
        mei_kana: string;
    };
    transaction?: Transaction;
};
