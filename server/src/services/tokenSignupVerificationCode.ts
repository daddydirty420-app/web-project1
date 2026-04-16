import { Transaction } from "sequelize";
import { TokenSignupVerification } from "../models/index.js";

type CreateTokenParams = {
    data: {
        user_id: number;
        verification_code: string;
          verification_code_expires: Date;
          reissue_token: string;
          reissue_token_expires: Date;
    };
    transaction?: Transaction;
};

export const createSignupToken = async ({ data, transaction }: CreateTokenParams) => {
    await TokenSignupVerification.create(data, { transaction });
};