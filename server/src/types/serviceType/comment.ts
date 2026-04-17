import { Transaction } from 'sequelize';
import { Comment } from '../../models/index.js';

export type CommentIdParams = {
    commentId: number;
};

export type ItemIdParams = {
    itemId: number;
};

export type UpdateParams = {
    comment: InstanceType<typeof Comment>;
    data: {
        sort_number: number;
    };
};

export type UpdateReportScoreParams = {
    comment: InstanceType<typeof Comment>;
    data: {
        report_score: number;
    };
    transaction?: Transaction;
};

export type CreateCommentParams = {
    data: {
        text: string;
        sort_number: number;
        item_id: number;
        user_id: number;
        parent_comment_id?: number;
        pin?: boolean;
    };
};

export type DestroyParams = {
    comment: InstanceType<typeof Comment>;
};

export type DestroyAllParams = {
    comments: InstanceType<typeof Comment>[];
    transaction: Transaction;
};
