import { AppError } from "../../errors.js";
import { getUserHasAddress } from "../../services/users/query.js";

type Params = {
    userId: number;
};

// GET /address/myaddress
// summary: 住所取得
// page: /edit/address
export const getMyAddressUseCase = async ({ userId }: Params) => {
    const user = await getUserHasAddress({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    const address = user.Address;

    if (!address) throw new AppError("ADDRESS_NOT_FOUND", 404);

    return address;
};
