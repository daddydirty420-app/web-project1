import { addPlayCount, getVideo } from '../../services/video.js';
import { AppError } from '../../errors.js';
import { getItem, updateSortNumber } from '../../services/items/index.js';

type Params = {
    videoId: number;
    userId: number | null;
};

export const onPlayVideoUseCase = async ({ videoId, userId }: Params) => {
    // video取得
    const video = await getVideo({ videoId });
    if (!video) {
        throw new AppError('VIDEO_NOT_FOUND', 404);
    }

    // 再生回数 +1
    const newPlayCount = (video.play_count += 1);

    addPlayCount({ video, data: { play_count: newPlayCount } }).catch((err) => {
        console.error('service video addPlayCount error:', err);
    });

    // item取得
    const itemId = video.item_id;

    const item = await getItem({ itemId });
    if (!item) {
        throw new AppError('ITEM_NOT_FOUND', 404);
    }

    // sort_number更新
    if (userId && item.status === 'active') {
        const newSortNumber = item.sort_number + 15;
        const newSortBuzzNumber = item.sort_buzz_number + 70;

        updateSortNumber({
            item,
            data: {
                sort_number: newSortNumber,
                sort_buzz_number: newSortBuzzNumber,
            },
        }).catch((err) => {
            console.error('service Item updateSortNumber error:', err);
        });
    }
};
