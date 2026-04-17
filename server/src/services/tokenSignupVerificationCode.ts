import { TokenSignupVerification, User } from "../models/index.js";
import {
    CreateTokenParams,
    DestroyTokenParams,
    ReissueUpdateParams,
    TokenParams,
    VerificationCodeParams,
} from "../types/serviceType/tokenSignupVerificationCode.js";

export const getTokenVerificationOne = ({ verificationCode }: VerificationCodeParams) => {
    return TokenSignupVerification.findOne({
        where: { verification_code: verificationCode },
    });
};

export const getTokenReissueOne = ({ token }: TokenParams) => {
    return TokenSignupVerification.findOne({
        where: { reissue_token: token },
        include: [{ model: User }],
    });
};

export const createSignupToken = async ({ data, transaction }: CreateTokenParams) => {
    await TokenSignupVerification.create(data, { transaction });
};

export const updateReissueToken = async ({ tokenRecord, data }: ReissueUpdateParams) => {
    await tokenRecord.update(data);
};

export const destroyToken = async ({ tokenRecord }: DestroyTokenParams) => {
    await tokenRecord.destroy();
};
