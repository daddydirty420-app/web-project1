import { AppError } from "../../errors.js";
import { getMyAddressOne } from "../../services/address.js";

type Params = {
    userId: number;
};

export const getMyAddressUseCase = async ({ userId }: Params) => {
    const data = await getMyAddressOne({ userId });

    if (!data) throw new AppError("MY_ADDRESS_NOT_FOUND", 404);

    return data;
};
