import { Association, Model } from "sequelize";

type SelectedVariant = {
    color?: string;
    size?: string;
    [key: string]: string | undefined;
};

export class PurchaseSession extends Model {
    declare id: number;
    declare buyer_user_id: number;
    declare item_id: number;
    declare address_id: number;
    declare name_id: number;
    declare coupon_user_id: number | null;
    declare buyer_phone_number: string | null;
    declare item_count: number | null; // 購入個数
    declare discount_amount: number | null; // 割引（クーポン等）
    declare points_used: number | null; // ポイント払い額
    declare payment_method_id: number | null;
    declare selected_variant: SelectedVariant;
    declare arrive_specified_date: Date | null;
    declare expires_at: Date;
    declare createdAt: Date;
    declare updatedAt: Date;
}
