import sequelize from "../../../db.js";
import { AppError } from "../../../errors.js";
import { createAddressShopEdit } from "../../../services/address.js";
import { createNotification } from "../../../services/notification.js";
import { getShop } from "../../../services/shopInfo.js";
import { createShopEdit } from "../../../services/shopInfoEdit.js";
import { fetchAddressFromZipUseCase } from "../../address/zipUseCase.js";

type Params = {
    shopId: number;
    userId: number;
    postNumber: string;
    todouhuken: string;
    shikutyouson: string;
    banchi: string;
    building?: string;
};

export const createAddressShopEditUseCase = async ({
    shopId,
    userId,
    postNumber,
    todouhuken,
    shikutyouson,
    banchi,
    building,
}: Params) => {
    // shopInfo取得
    const shop = await getShop({ shopId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    // 住所バリデーションチェック
    const fromZip = await fetchAddressFromZipUseCase({ zipcode: postNumber });

    if (!fromZip) throw new AppError("INVALID_POSTNUMBER", 400);
    if (fromZip.todouhuken_name !== todouhuken) {
        throw new AppError("NOT_SAME_POSTNUMBER_TODOUHUKEN", 400);
    }
    if (fromZip.shikutyouson !== shikutyouson) {
        throw new AppError("NOT_SAME_POSTNUMBER_SHIKUTYOUSON", 400);
    }

    // db登録
    await sequelize.transaction(async (t) => {
        const shopEdit = await createShopEdit({
            data: {
                user_id: userId,
                shop_info_id: shopId,
            },
            transaction: t,
        });

        await createAddressShopEdit({
            data: {
                post_number: postNumber,
                todouhuken_id: fromZip.todouhuken_id,
                shikutyouson: shikutyouson,
                banchi: banchi,
                building: building,
                shop_info_edit_id: shopEdit.id,
            },
            transaction: t,
        });
    });

    // お知らせ作成
    createNotification({
        data: {
            read_user_id: userId,
            message:
                "会社所在地の変更を受け付けました。審査には1~2週間程度お時間を要する場合がございます。審査完了までしばらくお待ちください。",
        },
    }).catch((err) => {
        console.error("service createNotification error:", err);
    });
};
