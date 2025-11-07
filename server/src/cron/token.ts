import cron from "node-cron";
import { Op } from "sequelize";
import { User, SignupVerificationTokens, PasswordResetTokens, EmailChangeTokens } from "../models/index.js";
import sequelize from "../db.js";

export const startTokenCron = () => {
    cron.schedule('0 * * * *', async () => {
        const now = new Date();

        const t = await sequelize.transaction();

        try {
            const expiredTokens = await SignupVerificationTokens.findAll({
                where: {
                    verification_code_expires: { [Op.lt]: now },
                    reissue_token_expires: { [Op.lt]: now }
                },
                transaction: t
            });

            if (expiredTokens.length === 0) {
                await t.commit();
                return;
            };

            const expiredUserIds = expiredTokens.map((tk: any) => tk.user_id);

            await User.destroy({
                where: {
                    id: { [Op.in]: expiredUserIds },
                    email_verified: false
                },
                transaction: t
            });

            await SignupVerificationTokens.destroy({
                where: { user_id: { [Op.in]: expiredUserIds } },
                transaction: t
            });

            await t.commit();
            console.log(`[cron] ${expiredUserIds.length}件の未認証ユーザーとトークンを削除しました。`)
        } catch (err) {
            await t.rollback();
            console.error('[cron] 未認証ユーザー削除エラー：', err);
        }
    }, {
        timezone: "Asia/Tokyo"
    });

    cron.schedule('0 * * * *', async () => {
        try {
            await PasswordResetTokens.destroy({
                where: {
                    expires_at: { [Op.lt]: new Date() }
                }
            });

            console.log('[cron] 期限切れパスワードリセットトークンを削除しました。');
        } catch (err) {
            console.error('[cron] pwリセットトークン削除エラー：', err);
        }
    }, {
        timezone: "Asia/Tokyo"
    });

    cron.schedule('0 * * * *', async () => {
        try {
            await EmailChangeTokens.destroy({
                where: {
                    expires_at: { [Op.lt]: new Date() }
                }
            });

            console.log('[cron] 期限切れメールアドレス変更トークンを削除しました。');
        } catch (err) {
            console.error('[cron] email変更トークン削除エラー：', err);
        }
    }, {
        timezone: "Asia/Tokyo"
    });
};