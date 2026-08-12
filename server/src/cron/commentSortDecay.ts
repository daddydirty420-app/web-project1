import cron from "node-cron";
import { Op } from "sequelize";
import { Comment } from "../models/index.js";

export const startCommentSortDecayCron = () => {
    // Comment.sort_number減算
    cron.schedule(
        "0 */2 * * *",
        async () => {
            try {
                const comments = await Comment.findAll({
                    where: {
                        sort_number: { [Op.gt]: 0.01 },
                    },
                });

                for (const comment of comments) {
                    const newSort = comment.sort_number / 2;

                    await comment.update({
                        sort_number: newSort,
                    });
                }

                console.log("[cron] Comment.sort_numberを減算しました。");
            } catch (err) {
                console.error("Comment.sort_number減算エラー：", err);
            }
        },
        {
            timezone: "Asia/Tokyo",
        },
    );
};
