export type DeleteOrderType = {
    orders_id: number;
    delivery_id: number;
    cancel_reason: string;
    refund_status: string;
    refund_method: string;
    refund_amount: number;
    deleted_by: number;
};
