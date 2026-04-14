import { ReferenceCode } from "../models/index.js";

type UserIdParams = {
    userId: number;
};

export const countReferenceOutput = ({ userId }: UserIdParams) => {
    return ReferenceCode.count({
        where: {
            output_user_id: userId,
            checked: true,
        },
    });
};