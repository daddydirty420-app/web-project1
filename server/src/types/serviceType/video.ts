import { Transaction } from 'sequelize';
import { Video } from '../../models/index.js';

export type VideoIdParams = {
    videoId: number;
};

export type PlayCountParams = {
    video: InstanceType<typeof Video>;
    data: {
        play_count: number;
    };
};

export type CreateVideoParams = {
    itemId: number;
    userId: number;
    transaction: Transaction;
};

export type UpdateStatusParams = {
    video: InstanceType<typeof Video>;
    data: {
        status: string;
        converted_url?: string;
        duration?: number;
    };
};

export type UpdateVideoParams = {
    video: InstanceType<typeof Video>;
    data: {
        title: string;
        summary: string;
        original_url: string | null;
        thumbnail_url: string | null;
    };
    transaction: Transaction;
};

export type CreateVideoCopyUploadParams = {
    data: {
        title: string;
        summary: string;
        duration: number;
        user_id: number;
        item_id: number;
        status: string;
        thumbnail_url: string;
        original_url: string | null;
        converted_url: string | null;
    };
    transaction: Transaction;
};
