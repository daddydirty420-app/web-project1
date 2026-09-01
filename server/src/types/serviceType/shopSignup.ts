import { Transaction } from "sequelize";
import { ShopSignup } from "../../models/index.js";

export type UserShopSignupIdParams = {
    userId: number;
    shopSignupId: number;
};

export type CreateShopSignupParams = {
    data: {
        company_name: string;
        shop_name: string;
        phone_number: string;
        email: string;
        homepage_url: string | null;
        open_date_time: string;
        company_number: string | null;
        capital: number;
        member_count: number;
        user_id: number;
        address_id: number;
        com_or_free_id: number;
        founded_date: Date;
        name_representative_id: number;
        name_contact_id: number;
    };
    transaction?: Transaction;
};

export type UpdateBankAccountParams = {
    shopSignup: InstanceType<typeof ShopSignup>;
    data: {
        account_id: number;
    };
    transaction?: Transaction;
};

export type UpdateSignup3Params = {
    shopSignup: InstanceType<typeof ShopSignup>;
    data: {
        idcard_id: number;
        permit_id: number | null;
    };
    transaction?: Transaction;
};
