import cron from "node-cron";
import { Op } from "sequelize";
import { Comment, Item, User } from "../models/index.js";
import sequelize from "../db.js";

export const startTrustScoreCron = () => {
    // report_trust_score 0.3 → 1.0 ユーザー信頼度
    cron.schedule("0 12 * * *", async () => {
        const thirtyDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

        const users = await User.findAll({
            where: {
                createdAt: { [Op.lt]: thirtyDaysAgo },
                report_trust_score: 0.3,
            },
        });

        if (!users || users.length === 0) {
            console.log(" [cron] 30日経過ユーザーはいません" );
            return;
        }

        const t = await sequelize.transaction();

        try {
            await Promise.all(users.map(async (user: typeof User) => {
                await user.update({
                    report_trusy_score: 1,
                }, { transaction: t });
            }));

            await t.commit();

            console.log(`[cron] 30日経過ユーザー${users.length}件の報告信頼度を1.0にしました`);
        } catch (err) {
            await t.rollback();
            console.log("[cron] 30日経過user.report_trust_scoreエラー：", err);
        }
    }, {
        timezone: "Asia/Tokyo",
    });

    // 商品信頼度 1日0.9倍
    cron.schedule("0 12 * * *", async () => {
        const items = await Item.findAll({
            where: {
                report_score: { [Op.gt]: 0 },
            },
        });

        if (!items || items.length === 0) {
            console.log(" [cron] report_score減点商品はありません" );
            return;
        }

        const t = await sequelize.transaction();

        try {
            await Promise.all(items.map(async (item: typeof Item) => {
                await item.update({
                    report_score: item.report_score * 0.9,
                }, { transaction: t });
            }));

            await t.commit();

            console.log(`[cron] ${items.length}件の商品のreport_scoreを減点しました`);
        } catch (err) {
            await t.rollback();
            console.log("[cron] 商品report_score減点エラー：", err);
        }
    }, {
        timezone: "Asia/Tokyo",
    });

    // コメント信頼度 1日0.9倍
    cron.schedule("0 12 * * *", async () => {
        const comments = await Comment.findAll({
            where: {
                report_score: { [Op.gt]: 0 },
            },
        });

        if (!comments || comments.length === 0) {
            console.log(" [cron] report_score減点コメントはありません" );
            return;
        }

        const t = await sequelize.transaction();

        try {
            await Promise.all(comments.map(async (comment: typeof Comment) => {
                await comment.update({
                    report_score: comment.report_score * 0.9,
                }, { transaction: t });
            }));

            await t.commit();

            console.log(`[cron] ${comments.length}件の商品のreport_scoreを減点しました`);
        } catch (err) {
            await t.rollback();
            console.log("[cron] コメントreport_score減点エラー：", err);
        }
    }, {
        timezone: "Asia/Tokyo",
    });
}