import { Transaction } from "sequelize";

export type CreatePermitFileParams = {
    data: {
        permit_id: number;
        s3_metadata_id: number;
        sort_order: number;
        document_name: string | null;
        memo: string | null;
    };
    transaction?: Transaction;
};
