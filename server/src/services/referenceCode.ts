import { ReferenceCode } from "../models/index.js";
import { CreateInputParams, CreateOutputParams, UserIdParams } from "../types/serviceType/referenceCode.js";

export const createInputCode = async ({ data }: CreateInputParams) => {
    await ReferenceCode.create(data);
};

export const createOutputCode = async ({ data }: CreateOutputParams) => {
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
