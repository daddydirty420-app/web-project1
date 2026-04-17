import { ReferenceCode } from '../models/index.js';

type UserIdParams = {
    userId: number;
};

type CreateOutputParams = {
    data: {
        output: string;
        output_user_id: number;
    };
};

export const createOutputData = async ({ data }: CreateOutputParams) => {
    await ReferenceCode.create(data);
};

export const countReferenceOutput = ({ userId }: UserIdParams) => {
    return ReferenceCode.count({
        where: {
            output_user_id: userId,
            checked: true,
        },
    });
};
