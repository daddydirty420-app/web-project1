import { Video } from "../models/index.js";
import { VideoIdParams } from "../types/serviceType/video.js";

type PlayCountParams = {
    video: InstanceType<typeof Video>;
    data: {
        play_count: number;
    };
};

type UpdateStatusParams = {
    video: InstanceType<typeof Video>;
    data: {
        status: string;
        converted_url?: string;
        duration?: number;
    };
};

export const findByPkVideo = async ({ videoId }: VideoIdParams) => {
    return Video.findByPk(videoId);
};

export const addPlayCount = async ({ video, data }: PlayCountParams) => {
    await video.update(data);
};

export const updateStatus = async ({ video, data }: UpdateStatusParams) => {
    await video.update(data);
};