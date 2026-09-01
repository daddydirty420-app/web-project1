import { Transaction } from "sequelize";

export type CreatePermitParams = {
    data: {
        permit_number: string | null;
        permit_type: string | null;
        issued_at: Date | null;
        expired_at: Date | null;
    };
    transaction?: Transaction;
};
