import { AppError } from "../../errors.js";
import { getComment, updateReportScore } from "../../services/comment.js";
import { createCommentReport, getCommentReportOption } from "../../services/commentReport.js";
import { getUser } from "../../services/users.js";

type Params = {
    commentId: number;
    userId: number;
    optionId: number;
};

export const createCommentReportUseCase = async ({ commentId, userId, optionId }: Params) => {
    // option取得
    const reportOption = await getCommentReportOption({ optionId });

    if (!reportOption) throw new AppError("OPTION_NOT_FOUND", 404);

    // comment取得
    const comment = await getComment({ commentId });

    if (!comment) throw new AppError("COMMENT_NOT_FOUND", 404);

    // user取得
    const user = await getUser({ userId });

    if (!user) throw new AppError("USER_NOT_FOUND", 404);

    // CommentReport作成
    await createCommentReport({
        data: {
            comment_id: commentId,
            report_user_id: userId,
            option_id: optionId,
        },
    });

    // report_score更新
    const newReportScore = Number(comment.report_score) + Number(user.report_trust_score);

    updateReportScore({
        comment, 
        data: {
            report_score: newReportScore,
        },
    }).catch((err) => {
        console.error("service updateReportScore error:", err);
    });
};