import { AppError } from "../../errors.js";
import { Item, Video } from "../../models/index.js";

type Params = {
    videoId: number;
    userId: number | null;
};

export const onPlayVideo = async ({ videoId, userId }: Params) => {

    // video取得
    const video = await Video.findByPk(videoId);
    if (!video) {
        throw new AppError("VIDEO_NOTFOUND", 404);
    }
    
    // 再生回数 +1
    video.play_count += 1;
    await video.save();
    
    // item取得
    const item = await Item.findByPk(video.item_id);
    if (!item) {
        throw new AppError("ITEM_NOTFOUND", 404);
    }

    // sort_number更新
    if (userId && item.status === "active") {
        item.sort_number += 15;
        item.sort_buzz_number += 70;
        await item.save();
    }
};