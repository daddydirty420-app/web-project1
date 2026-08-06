import cron from "node-cron";
import { col, Op, where } from "sequelize";
import { getExpiredAll } from "../services/pointLots.js";
import { createPoint180, createUriage180 } from "../services/pointsUriageOver.js";
import { createTransfer } from "../services/transfer.js";
import { getExpiredUriageAll } from "../services/uriagekinLots.js";
import { getUserHasBankAccount } from "../services/users/query.js";
import { UriagekinLotsInstance } from "../types/serviceType/uriagekinLots.js";
import { generateTransferId } from "../utils/generateTransferId.js";

export const StartExpiredMoneyCron = () => {
    // 180日経過ポイント回収
    cron.schedule(
        "0 12 * * *",
        async () => {
            const nowDate = new Date();

            try {
                const whereCondition = {
                    [Op.and]: [{ expires_at: { [Op.lt]: nowDate } }, where(col("used_points"), Op.lt, col("points"))],
                };

                const allExpiredData = await getExpiredAll({ where: whereCondition });

                let sumPoints = 0;

                for (const data of allExpiredData) {
                    const available = data.points - data.used_points;

                    await createPoint180({
                        data: {
                            points_180: available,
                        },
                    });

                    sumPoints = sumPoints + available;
                }

                console.log(`[cron] 180日経過ポイントを回収しました: ${allExpiredData.length}件 ${sumPoints}円`);
            } catch (err) {
                console.error("期限切れポイント回収エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );

    // 180日経過売上金回収
    cron.schedule(
        "0 12 * * *",
        async () => {
            const nowDate = new Date();
            const twoWeeksLater = new Date(nowDate.getTime() + 14 * 24 * 60 * 60 * 1000);

            try {
                const whereCondition = {
                    [Op.and]: [
                        { expires_at: { [Op.lt]: nowDate } },
                        where(col("used_uriagekin"), Op.lt, col("uriagekin")),
                    ],
                };

                const allExpiredData = await getExpiredUriageAll({ where: whereCondition });

                let sumGetUriagekin = 0;
                let sumTransUriagekin = 0;

                // user_idごとにグループ化
                const groupedByUserId = allExpiredData.reduce<Record<number, UriagekinLotsInstance[]>>(
                    (acc: Record<number, UriagekinLotsInstance[]>, data: UriagekinLotsInstance) => {
                        const userId: number = data.user_id;
                        if (!acc[userId]) {
                            acc[userId] = [];
                        }
                        acc[userId].push(data);
                        return acc;
                    },
                    {},
                );

                // user_idごとに処理
                for (const [userId, userDataList] of Object.entries(groupedByUserId)) {
                    try {
                        // このuser_idの(uriagekin - used_uriagekin)の合計
                        const sumRemainingUriagekin: number = userDataList.reduce(
                            (sum: number, data: UriagekinLotsInstance) => sum + (data.uriagekin - data.used_Uriagekin),
                            0,
                        );

                        // ユーザー情報 + BankAccountを取得
                        const user = await getUserHasBankAccount({ userId: Number(userId) });

                        if (!user) {
                            console.error(`user_id: ${userId} が見つかりませんでした`);
                            continue;
                        }

                        if (user.BankAccount) {
                            // BankAccountがある場合 → Transferデータを作成
                            const account = user.BankAccount;
                            const transferId = await generateTransferId();

                            await createTransfer({
                                data: {
                                    request_money: sumRemainingUriagekin,
                                    handling_charge: 200,
                                    trans_money: sumRemainingUriagekin,
                                    trans_reason_id: 3,
                                    user_id: Number(userId),
                                    trans_schedule_date: twoWeeksLater,
                                    transfer_id: transferId,
                                    bank_snapshot: {
                                        bank_name: account.bank_name,
                                        branch_name: account.branch,
                                        account_type: account.account_type,
                                        account_number: account.account_number,
                                        meigi: account.meigi,
                                    },
                                },
                            });

                            sumTransUriagekin = sumTransUriagekin + sumRemainingUriagekin;
                        } else {
                            // BankAccountが無い場合 → PointsUriagekinOverを作成
                            await createUriage180({
                                data: {
                                    uriagekin_180: sumRemainingUriagekin,
                                },
                            });

                            sumGetUriagekin = sumGetUriagekin + sumRemainingUriagekin;
                        }
                    } catch {
                        console.error(`userId: ${userId}の売上金回収処理中にエラー発生`);
                        continue;
                    }
                }

                console.log(
                    `[cron] 180日経過売上金を回収しました: ${allExpiredData.length}件 振込額：${sumTransUriagekin}円 回収額：${sumGetUriagekin}円`,
                );
            } catch (err) {
                console.error("期限切れ売上金回収エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );
};
