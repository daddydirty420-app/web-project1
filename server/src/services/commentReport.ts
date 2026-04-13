import { CommentReport, CommentReportOption } from "../models/index.js";

type CommentIdParams = {
    commentId: number;
};

export const countCommentReport = ({ commentId }: CommentIdParams) => {
    return CommentReport.count({
        where: { comment_id: commentId },
    });
};

export const getCommentReportOptions = () => {
    return CommentReportOption.findAll();
};