import type { Transaction } from "sequelize";

export type CreatePurchaseSessionParams = {
    data: {
        buyer_user_id: number;
        item_id: number;
        address_id: number;
        name_id: number;
        buyer_phone_number: string | null;
        expires_at: Date;
    };
    transaction?: Transaction;
};

export type CronDeleteParams = {
    now: Date;
    transaction?: Transaction;
}
