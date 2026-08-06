import { Transaction } from "sequelize";
import { Delivery } from "../../models/index.js";

export type ItemIdParams = {
    itemId: number;
};

export type DeliveryIdParams = {
    deliveryId: number;
};

export type DeliveryUserIdParams = {
    deliveryId: number;
    userId: number;
};

export type CreateDeliveryParams = {
    data: {
        buyer_phone_number: string;
        shipping_day_id: number;
        shipping_service_id: number;
        delivery_status_id: number;
        shipping_place_id: number;
        item_id: number;
        address_id: number;
        name_id: number;
        shipping_from_name: string;
        shipping_from_postcode: string;
        shipping_from_prefecture: string;
        shipping_from_address_line1: string;
        shipping_from_address_line2: string;
        shipping_from_phone: string;
    };
    transaction?: Transaction;
};

export type UpdateDeliveryCancelParams = {
    delivery: InstanceType<typeof Delivery>;
    data: {
        cancel: boolean;
    };
    transaction?: Transaction;
};
