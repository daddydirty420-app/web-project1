import { Permit } from "../models/index.js";
import { CreatePermitParams } from "../types/serviceType/permit.js";

export const createPermit = async ({ data, transaction }: CreatePermitParams) => {
    return Permit.create(data, { transaction });
};
