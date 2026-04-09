import { Video } from "../models/index.js";
import { CreateVideoCopyUploadParams, PlayCountParams, UpdateStatusParams, UpdateVideoParams, VideoIdParams } from "../types/serviceType/video.js";

export const findByPkVideo = ({ videoId }: VideoIdParams) => {
    return Video.findByPk(videoId);
};

export const addPlayCount = async ({ video, data }: PlayCountParams) => {
    await video.update(data);
};

export const updateStatus = async ({ video, data }: UpdateStatusParams) => {
    await video.update(data);
};

export const updateVideo = async ({ video, data, transaction }: UpdateVideoParams) => {
    await video.update(data, { transaction });
};

export const createVideoCopyUpload = async ({ data, transaction }: CreateVideoCopyUploadParams) => {
    await Video.create(data, { transaction });
};