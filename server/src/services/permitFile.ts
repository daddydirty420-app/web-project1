import { PermitFile } from "../models/index.js";
import { CreatePermitFileParams } from "../types/serviceType/permitFile.js";

export const createPermitFile = async ({ data, transaction }: CreatePermitFileParams) => {
    return PermitFile.create(data, { transaction });
};
