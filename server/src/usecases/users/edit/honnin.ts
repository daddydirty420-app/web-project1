import sequelize from "../../../db.js";
import { AppError } from "../../../errors.js";
import { s3Domain } from "../../../infra/aws/s3.js";
import { updateAddress } from "../../../services/address.js";
import { createIdCard, updateIdCard } from "../../../services/idCard.js";
import { updateName } from "../../../services/name.js";
import { createNotification } from "../../../services/notification.js";
import { getTodouhukenOne } from "../../../services/todouhuken.js";
import { updateHonninUser, updateIdCardIdUser } from "../../../services/users/command.js";
import { getUserWithAddressNameId } from "../../../services/users/query.js";
import { deleteCmdS3 } from "../../../utils/s3/deleteCmd.js";
import { generateSignedUrl } from "../../../utils/s3/signedUrl.js";
import { HonninBody } from "../../../validators/body/users.js";

type Params = {
    userId: number;
    body: HonninBody;
};

// PATCH /user/honnin
// summary: 本人確認リクエスト
// page: /edit/honnin
export const editHonninUserUseCase = async ({ userId, body }: Params) => {
    const now = Date.now();

    const {
        sei,
        mei,
        seiKana,
        meiKana,
        birthday,
        postNumber,
        todouhuken,
        shikutyouson,
        banchi,
        building,
        phoneNumber,
        selectedGender,
        frontFileName,
        frontFileType,
        rearFileName,
        rearFileType,
        idFrontUpload,
        idRearUpload,
    } = body;

    // 空チェック
    const requiredBody = [
        sei,
        mei,
        seiKana,
        meiKana,
        birthday,
        postNumber,
        todouhuken,
        shikutyouson,
        banchi,
        phoneNumber,
        selectedGender,
        idFrontUpload,
        idRearUpload,
    ];

    if (requiredBody.some((v) => v === "" || v === undefined || v === null)) {
        throw new AppError("INVALID_BODY", 400);
    }

    const formattedBirthday = new Date(birthday);

    // user取得
    const user = await getUserWithAddressNameId({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    // 都道府県バリデーションチェック
    const todouhukenData = await getTodouhukenOne({ todouhuken });

    if (!todouhukenData) throw new AppError("TODOUHUKEN_NOT_FOUND", 404);

    const todouhukenId = todouhukenData.id;
    if (todouhukenId < 1 || todouhukenId > 47) {
        throw new AppError("INVALID_TODOUHUKEN", 400);
    }

    // 身分証url発行
    let frontSignedUrl: string | null = null;
    let rearSignedUrl: string | null = null;
    let frontUrl: string | null = null;
    let rearUrl: string | null = null;
    let oldFrontUrl = user.IdCard?.id_card_front || null;
    let oldRearUrl = user.IdCard?.id_card_rear || null;

    if (frontFileName && frontFileType && idFrontUpload) {
        const key = `idcard/front/${userId}/${now}_${frontFileName}`;

        frontSignedUrl = await generateSignedUrl({ key, contentType: frontFileType });

        frontUrl = `${s3Domain}/${key}`;
    }

    if (rearFileName && rearFileType && idRearUpload) {
        const key = `idcard/rear/${userId}/${now}_${rearFileName}`;

        rearSignedUrl = await generateSignedUrl({ key, contentType: rearFileType });

        rearUrl = `${s3Domain}/${key}`;
    }

    // 旧身分証URL削除
    if (idFrontUpload && oldFrontUrl && frontUrl && frontUrl !== oldFrontUrl) {
        const oldFrontKey = oldFrontUrl.split(".com/")[1];

        deleteCmdS3({ key: oldFrontKey }).catch((err) => {
            console.error("s3 deleteCmdS3 error:", err);
        });
    }

    if (idRearUpload && oldRearUrl && rearUrl && rearUrl !== oldRearUrl) {
        const oldRearKey = oldRearUrl.split(".com/")[1];

        deleteCmdS3({ key: oldRearKey }).catch((err) => {
            console.error("s3 deleteCmdS3 error:", err);
        });
    }

    // DB更新
    await sequelize.transaction(async (t) => {
        if (frontUrl && rearUrl) {
            if (user.IdCard) {
                await updateIdCard({
                    idCard: user.IdCard,
                    data: {
                        id_card_front: frontUrl,
                        id_card_rear: rearUrl,
                    },
                    transaction: t,
                });
            } else {
                const newIdCard = await createIdCard({
                    data: {
                        id_card_front: frontUrl,
                        id_card_rear: rearUrl,
                    },
                    transaction: t,
                });

                await updateIdCardIdUser({
                    user,
                    data: { idcard_id: newIdCard.id },
                    transaction: t,
                });
            }
        }

        if (user.Address) {
            await updateAddress({
                address: user.Address,
                data: {
                    post_number: postNumber,
                    todouhuken_id: todouhukenId,
                    shikutyouson: shikutyouson,
                    banchi: banchi,
                    building: building,
                },
                transaction: t,
            });
        }

        if (user.Name) {
            await updateName({
                name: user.Name,
                data: {
                    sei: sei,
                    mei: mei,
                    sei_kana: seiKana,
                    mei_kana: meiKana,
                },
                transaction: t,
            });
        }

        await updateHonninUser({
            user,
            data: {
                honnin_verify_request: true,
                honnin_verified: false,
                birthday: formattedBirthday,
                phone_number: phoneNumber,
                gender_id: Number(selectedGender),
            },
            transaction: t,
        });
    });

    // お知らせ作成
    createNotification({
        data: {
            read_user_id: userId,
            message:
                "本人確認を開始しました。本人確認の完了には1~2週間程度お時間を要する場合がございます。完了までしばらくお待ちください。",
            type: "USER_EDIT",
        },
    }).catch((err) => {
        console.error("service createNotification error:", err);
    });

    return { frontSignedUrl, rearSignedUrl };
};
