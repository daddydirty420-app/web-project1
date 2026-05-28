import { AppError } from "../../../errors.js";
import { createNotification } from "../../../services/notification.js";
import { updateShopCompanyName } from "../../../services/shopInfo/command.js";
import { getShop } from "../../../services/shopInfo/query.js";
import { createShopEditCompanyName } from "../../../services/shopInfoEdit/command.js";

type Params = {
    shopId: number;
    userId: number;
    companyName: string;
};

// POST /shop-info-edit/:id/company-name
// summary: 会社名変更リクエスト
// page: /edit/shop/company-name/[id]
export const createCompanyNameUseCase = async ({ shopId, userId, companyName }: Params) => {
    // ショップ取得
    const shop = await getShop({ shopId });

    if (!shop) throw new AppError("SHOP_NOT_FOUND", 404);
    if (shop.user_id !== userId) throw new AppError("FORBIDDEN", 403);

    const comFreeId = shop.com_or_free_id;

    // db作成・更新
    if (comFreeId === 1) {
        await createShopEditCompanyName({
            data: {
                user_id: userId,
                shop_info_id: shopId,
                company_name: companyName,
            },
        });

        createNotification({
            data: {
                read_user_id: userId,
                message:
                    "会社名の変更を受け付けました。審査には1~2週間程度お時間を要する場合がございます。審査完了までしばらくお待ちください。",
                type: "SHOP_EDIT",
            },
        }).catch((err) => {
            console.error("service createNotification error:", err);
        });
    } else if (comFreeId === 2) {
        await updateShopCompanyName({
            shopInfo: shop,
            data: {
                company_name: companyName,
            },
        });
    } else {
        throw new AppError("INVALID_COM_FREE_ID", 400);
    }
};
