import { AppError } from "../../../errors.js";
import { s3Domain } from "../../../infra/aws/s3.js";
import { updateShopName } from "../../../services/shopInfo.js";
import { updateProfileUser } from "../../../services/users/command.js";
import { getUserHasShop } from "../../../services/users/query.js";
import { deleteCmdS3 } from "../../../utils/s3/deleteCmd.js";
import { generateSignedUrl } from "../../../utils/s3/signedUrl.js";

type Body = {
    userName: string;
    introduction: string | null;
    fileName?: string;
    contentType?: string;
};

type Params = {
    userId: number;
    body: Body;
    imageEdit: boolean;
};

export const editProfileUseCase = async ({ userId, body, imageEdit }: Params) => {
    const now = Date.now();

    const { userName, introduction, fileName, contentType } = body;

    const user = await getUserHasShop({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    let signedUrl: string | null = null;
    let imageUrl: string | null = null;
    let oldImageUrl = user.profile_image;

    if (fileName && contentType && imageEdit) {
        const key = `profile-image/${userId}/${now}_${fileName}`;

        signedUrl = await generateSignedUrl({ key, contentType });

        imageUrl = `${s3Domain}/${key}`;
    }

    const updateData: any = {
        user_name: userName,
        user_introduction: introduction,
    };

    if (imageEdit) {
        updateData.profile_image = imageUrl;
    }

    await updateProfileUser({
        user,
        data: updateData,
    });

    const hasShop = !!user.ShopInfo;

    if (hasShop) {
        await updateShopName({
            shopInfo: user.ShopInfo,
            data: { shop_name: userName },
        });
    }

    if ((!fileName && imageEdit && oldImageUrl) || (imageUrl && oldImageUrl && imageUrl !== oldImageUrl)) {
        const oldKey = oldImageUrl.split(".com/")[1];

        deleteCmdS3({ key: oldKey }).catch((err) => {
            console.error("s3 deleteCmdS3 error:", err);
        });
    }

    return { signedUrl, imageUrl };
};
