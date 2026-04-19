import { Op } from "sequelize";
import { TokenEmailChange } from "../models/index.js";

type TokenParams = {
    token: string;
};

type TokenCreateParams = {
    data: {
        token_hash: string;
        expires_at: Date;
        user_id: number;
        new_email: string;
    };
};

export const getTokenEmailChangeOne = ({ token }: TokenParams) => {
    return TokenEmailChange.findOne({
        where: {
            token_hash: token,
            expires_at: { [Op.gt]: new Date() },
        },
    });
};

export const createTokenEmailChange = async ({ data }: TokenCreateParams) => {
    await TokenEmailChange.create(data);
};
