import cron from "node-cron";
import { deleteCronEmailChangeTokensUseCase } from "../usecases/token/cronEmailTokenDelete.js";
import { deleteCronPasswordResetTokensUseCase } from "../usecases/token/cronPasswordResetTokenDelete.js";
import { deleteCronRefreshTokensUseCase } from "../usecases/token/cronRefreshTokenDelete.js";
import { deleteCronUnverifiedUsersUseCase } from "../usecases/users/cron/cronDeleteUser.js";

export const startTokenCron = () => {
    // 未認証ユーザー削除
    cron.schedule(
        "0 * * * *",
        async () => {
            try {
                const deletedCount = await deleteCronUnverifiedUsersUseCase();

                if (deletedCount === 0) {
                    console.log("[cron] 未認証削除ユーザーはありません。");
                    return;
                }

                console.log(`[cron] ${deletedCount}件の未認証ユーザーとトークンを削除しました。`);
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
            try {
                const destroyTokens = await deleteCronPasswordResetTokensUseCase();

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
            try {
                const destroyTokens = await deleteCronEmailChangeTokensUseCase();

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
            try {
                const destroyTokens = await deleteCronRefreshTokensUseCase();

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
