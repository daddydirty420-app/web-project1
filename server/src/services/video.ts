import { Video } from "../models/index.js";
import { VideoIdParams } from "../types/serviceType/video.js";

type PlayCountParams = {
    video: InstanceType<typeof Video>;
    data: {
        play_count: number;
    };
};

export const findByPkVideo = async ({ videoId }: VideoIdParams) => {
    return Video.findByPk(videoId);
};

export const addPlayCount = async ({ video, data }: PlayCountParams) => {
    await video.update(data);
};