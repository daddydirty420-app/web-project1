import sequelize from "../../../db.js";
import { updateReportTrustScoreUser } from "../../../services/users/command.js";
import { getCronUserTrustScore } from "../../../services/users/query.js";

// report_trust_score 0.3 → 1.0 ユーザー信頼度
export const cronUserTrustScoreUseCase = async (): Promise<number> => {
    const thirtyDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);
    const users = await getCronUserTrustScore({
        createdBefore: thirtyDaysAgo,
        reportTrustScore: 0.3,
    });

    if (users.length === 0) return 0;

    await sequelize.transaction(async (transaction) => {
        for (const user of users) {
            await updateReportTrustScoreUser({
                user,
                data: { report_trust_score: 1 },
                transaction,
            });
        }
    });

    return users.length;
};
