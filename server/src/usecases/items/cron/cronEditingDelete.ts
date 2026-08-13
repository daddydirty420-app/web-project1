import { destroyCronEditingItems } from "../../../services/items/index.js";

// 1週間放置item削除
export const cronEditingDeleteUseCase = async (): Promise<number> => {
    const sevenDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7);

    return await destroyCronEditingItems({ createdBefore: sevenDaysAgo });
};
