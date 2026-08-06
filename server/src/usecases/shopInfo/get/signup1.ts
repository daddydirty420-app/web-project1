import { AppError } from "../../../errors.js";
import { getComFreeOptionAll } from "../../../services/comOrFreeOption.js";
import { getShopSignup1One } from "../../../services/shopInfo/query.js";
import { getUserShopSignup1 } from "../../../services/users/query.js";

type Props = {
    userId: number;
};

// GET /shop-info/signup/1
// summary: 事業者情報登録ページ インプット表示データ取得
// page: /shop-signup/step1
export const getShopSignup1UseCase = async ({ userId }: Props) => {
    // shopInfo取得（無くても可）
    const shop = await getShopSignup1One({ userId });

    if (shop.user_id && shop.user_id !== userId) {
        throw new AppError("FORBIDDEN", 403);
    }

    // user取得
    const user = await getUserShopSignup1({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    // comOrFree取得
    const comFree = await getComFreeOptionAll();

    return { shop, user, comFree };
};
