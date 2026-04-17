export type CommentIdParams = {
    commentId: number;
};

export type OptionIdParams = {
    optionId: number;
};

export type CreateCommentReportParams = {
    data: {
        comment_id: number;
        report_user_id: number;
        option_id: number;
    };
};
