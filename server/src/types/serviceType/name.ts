import { Transaction } from "sequelize";
import { Name } from "../../models/index.js";

export type UserIdParams = {
    userId: number;
};

export type NameIdParams = {
    nameId: number;
};

export type DeliveryIdParams = {
    deliveryId: number;
};

export type CreateNameParams = {
    data: {
        user_id?: number | null;
        sei?: string;
        mei?: string;
        sei_kana?: string;
        mei_kana?: string;
        shop_info_edit_id?: number | null;
        shop_type?: "representative" | "contact" | null;
        delivery_id?: number;
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
