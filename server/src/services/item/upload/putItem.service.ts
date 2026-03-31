import { AppError } from "../../../errors.js";
import { Item, ItemShippingProfile, Sale, Video } from "../../../models/index.js";
import { Body } from "../../../types/items/uploadBody.js";
import { checkBrands } from "./master/check/checkBrands.js";
import { checkMasterTable } from "./master/check/checkMasterTable.js";
import { checkNumber } from "./master/check/checkNumber.js";
import { putData } from "./master/putData.js";
import { getAttributesImagesUrl } from "./master/signedUrl/getAttributesImage.js";
import { getItemImagesUrl } from "./master/signedUrl/getItemImagesUrl.js";
import { getThumbnailUrl } from "./master/signedUrl/getThumbnailUrl.js";
import { getVideoUrl } from "./master/signedUrl/getVideoUrl.js";

export type UploadMode = 
| "main"
| "draft";

type Params = {
    itemId: number;
    userId: number;
    mode: UploadMode;
    body: Body;
};

export const PutItem = async ({ itemId, userId, mode, body }: Params) => {
        
    const item = await Item.findByPk(itemId, {
        include: [
            { model: Video },
            { model: Sale },
            { model: ItemShippingProfile },
        ],
    });

    if (!item) {
        throw new AppError("ITEM_NOT_FOUND", 404);
    }

    // 動画署名付きURL生成
    const { videoUrl, videoSignedUrl } = await getVideoUrl({
        itemId,
        userId,
        body,
        mode,
        item
    });
    
    // サムネイル署名付きURL生成
    const { thumbnailUrl, thumbnailSignedUrl } = await getThumbnailUrl({
        itemId,
        userId,
        body,
        mode,
        item
    });
    
    // 商品画像署名付きURL生成
    const { finalImageUrls, itemImageSignedUrls } = await getItemImagesUrl({
        itemId,
        userId,
        body,
        mode,
        item
    });
    
    // attributes.image署名付きURL生成
    const { finalAttributesImageUrls, attributesImageSignedUrls } = await getAttributesImagesUrl({
        itemId,
        userId,
        body,
        item
    });

    // 数値チェック
    const {
        categoryId,
        conditionId,
        dayId,
        serviceId,
        placeId,
        priceNum
    } = checkNumber({ body });
    
    // マスターテーブルチェック
    const categoryOption = await checkMasterTable({
        categoryId,
        conditionId,
        dayId,
        serviceId,
        placeId
    });

    // ブランドチェック
    const brandResult = await checkBrands({ body });

    // データ更新
    await putData({
        userId,
        itemId,
        mode,
        body,
        item,
        thumbnailUrl,
        videoUrl,
        finalImageUrls,
        finalAttributesImageUrls,
        categoryOption,
        categoryId,
        conditionId,
        dayId,
        serviceId,
        placeId,
        priceNum,
        brandResult
    });

    return {
        videoSignedUrl,
        thumbnailSignedUrl,
        itemImageSignedUrls,
        attributesImageSignedUrls
    };
};