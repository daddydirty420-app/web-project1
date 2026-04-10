import { Video } from "../models/index.js";
import { CreateVideoCopyUploadParams, CreateVideoParams, PlayCountParams, UpdateStatusParams, UpdateVideoParams, VideoIdParams } from "../types/serviceType/video.js";

export const getVideo = ({ videoId }: VideoIdParams) => {
    return Video.findByPk(videoId);
};

export const addPlayCount = async ({ video, data }: PlayCountParams) => {
    await video.update(data);
};

export const createVideo = async ({ itemId, userId, transaction }: CreateVideoParams) => {
    await Video.create({
        user_id: userId,
        item_id: itemId,
    }, { transaction });
};

export const createVideoCopyUpload = async ({ data, transaction }: CreateVideoCopyUploadParams) => {
    await Video.create(data, { transaction });
};

export const updateStatus = async ({ video, data }: UpdateStatusParams) => {
    await video.update(data);
};

export const updateVideo = async ({ video, data, transaction }: UpdateVideoParams) => {
    await video.update(data, { transaction });
};