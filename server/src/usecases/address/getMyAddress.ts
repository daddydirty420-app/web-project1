import { AppError } from "../../errors.js";
import { getMyAddressOne } from "../../services/address.js";

type Params = {
    userId: number;
};

// GET /address/myaddress
// summary: 住所取得
// page: /edit/address
export const getMyAddressUseCase = async ({ userId }: Params) => {
    const data = await getMyAddressOne({ userId });

    if (!data) throw new AppError("MY_ADDRESS_NOT_FOUND", 404);

    return data;
};
