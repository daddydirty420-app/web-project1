import { createItemLike, getItemLikeOne } from '../../services/itemLike.js';
import { AppError } from '../../errors.js';
import { patchSortNumberAddUseCase } from '../item/sortNumber/sortNumber.js';

type Params = {
    itemId: number;
    userId: number;
};

export const addItemLikeUseCase = async ({ itemId, userId }: Params) => {
    const data = await getItemLikeOne({ itemId, userId });

    if (data) {
        throw new AppError('ALREADY_LIKE_ITEM', 409, 'すでにいいね済みです');
    }

    await createItemLike({ itemId, userId });

    const number = 50;
    const buzzNumber = 200;

    patchSortNumberAddUseCase({ itemId, number, buzzNumber }).catch((err) => {
        console.error('usecase patchSortNumberAdd error:', err);
    });
};
