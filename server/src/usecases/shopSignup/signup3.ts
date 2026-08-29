import { AppError } from "../../errors.js";
import { getMyShopSignupHasS3Data } from "../../services/shopSignup.js";
import { ShopSignup3Body } from "../../validators/body/shopSignup.js";

type Params = {
    shopSignupId: number;
    userId: number;
    body: ShopSignup3Body;
};

// PATCH /shop-signup/:id/id-card
// summary: ショップ登録身分証・許認可証追加
// page: /shop-signup/step3/[id]
export const updateShopSignup3UseCase = async ({ shopSignupId, userId, body }: Params) => {
    const now = Date.now();

    const { frontIdCard, rearIdCard, permitFiles } = body;

    // shopSignup取得
    const shopSignup = await getMyShopSignupHasS3Data({ shopSignupId, userId });

    if (!shopSignup) throw new AppError("SHOP_SIGNUP_NOT_FOUND", 404);

    // 既存の身分証S3Metadata
    const idCard = shopSignup?.IdCard;

    const frontS3Metadata = idCard?.FrontIdCard ?? null;
    const rearS3Metadata = idCard?.RearIdCard ?? null;

    // 新しい表面ファイルをアップロード
    if (frontIdCard) {
        const objectKey = `idcard/front/${shopSignupId}/${now}_${frontIdCard.fileName}`;
        // S3へアップロード
        // S3Metadata作成
        // IdCard.front_s3_metadata_id更新
        // 旧S3オブジェクト削除
        // 旧S3Metadata削除
    }

    // 新しい裏面ファイルをアップロード
    if (rearIdCard) {
        // 同上
    }
};
