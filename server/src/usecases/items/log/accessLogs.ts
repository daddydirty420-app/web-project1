import { AppError } from '../../../errors.js';
import { addViewsCount, getItem, updateSortNumber } from '../../../services/items/index.js';
import { createWatchHistory, getWatchHistoryOne, updateUpdateAt } from '../../../services/watchHistory.js';

type Params = {
    itemId: number;
    userId: number | null;
};

export const patchItemLogsAccessUseCase = async ({ itemId, userId }: Params) => {
    // Item取得
    const item = await getItem({ itemId });
    if (!item) {
        throw new AppError('ITEM_NOT_FOUND', 404);
    }

    // WatchHistory作成・更新
    if (userId) {
        const history = await getWatchHistoryOne({ itemId, userId });

        if (history) {
            updateUpdateAt({ history }).catch((err) => {
                console.error('service WatchHistory updateUpdateAt error:', err);
            });
        } else {
            createWatchHistory({ itemId, userId }).catch((err) => {
                console.error('service WatchHistory createWatchHistory error:', err);
            });
        }
    }

    // views_count、sort_number追加
    if (item.seller_id !== userId) {
        const newViewsCount = item.views_count + 1;

        addViewsCount({ item, data: { views_count: newViewsCount } }).catch((err) => {
            console.error('item service addViewsCount error:', err);
        });

        const addSort = item.recommend ? 10 : 5;
        const addBuzzSort = item.recommend ? 60 : 30;

        const newSort = item.sort_number + addSort;
        const newSortBuzz = item.sort_buzz_number + addBuzzSort;

        updateSortNumber({
            item,
            data: {
                sort_number: newSort,
                sort_buzz_number: newSortBuzz,
            },
        }).catch((err) => {
            console.error('item service updateSortNumber error:', err);
        });
    }
};
