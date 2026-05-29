import cron from "node-cron";
import { Op } from "sequelize";
import sequelize from "../db.js";
import { RefreshTokens, TokenEmailChange, TokenPasswordReset, TokenSignupVerification, User } from "../models/index.js";

export const startTokenCron = () => {
    // 未認証ユーザー削除
    cron.schedule(
        "0 * * * *",
        async () => {
            const now = Date.now();

            try {
                const expiredTokens = await TokenSignupVerification.findAll({
                    where: {
                        verification_code_expires: { [Op.lt]: now },
                        reissue_token_expires: { [Op.lt]: now },
                    },
                });

                if (expiredTokens.length === 0) {
                    console.log("[cron] 未認証削除ユーザーはありません。");
                    return;
                }

                const expiredUserIds = expiredTokens.map((tk: any) => tk.user_id);

                await sequelize.transaction(async (t) => {
                    await User.destroy({
                        where: {
                            id: { [Op.in]: expiredUserIds },
                            email_verified: false,
                        },
                        transaction: t,
                    });

                    await TokenSignupVerification.destroy({
                        where: { user_id: { [Op.in]: expiredUserIds } },
                        transaction: t,
                    });
                });

                console.log(`[cron] ${expiredUserIds.length}件の未認証ユーザーとトークンを削除しました。`);
            } catch (err) {
                console.error("[cron] 未認証ユーザー削除エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );

    // TokenPasswordReset削除
    cron.schedule(
        "0 * * * *",
        async () => {
            const now = Date.now();

            try {
                const destroyTokens = await TokenPasswordReset.destroy({
                    where: {
                        expires_at: { [Op.lt]: now },
                    },
                });

                console.log(`[cron] ${destroyTokens}件の期限切れパスワードリセットトークンを削除しました。`);
            } catch (err) {
                console.error("[cron] pwリセットトークン削除エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );

    // TokenEmailChange削除
    cron.schedule(
        "0 * * * *",
        async () => {
            const now = Date.now();

            try {
                const destroyTokens = await TokenEmailChange.destroy({
                    where: {
                        expires_at: { [Op.lt]: now },
                    },
                });

                console.log(`[cron] ${destroyTokens}件の期限切れメールアドレス変更トークンを削除しました。`);
            } catch (err) {
                console.error("[cron] email変更トークン削除エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );

    // 期限切れRefreshTokens削除
    cron.schedule(
        "0 */3 * * *",
        async () => {
            const now = Date.now();

            try {
                const destroyTokens = await RefreshTokens.destroy({
                    where: {
                        expires_at: { [Op.lt]: now },
                    },
                });

                console.log(`[cron] ${destroyTokens}件の期限切れrefreshTokensを削除しました。`);
            } catch (err) {
                console.error("[cron] 期限切れrefreshTokens削除エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );
};
