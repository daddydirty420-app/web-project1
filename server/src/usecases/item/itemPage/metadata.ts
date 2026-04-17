import { AppError } from '../../../errors.js';
import { getMetadata } from '../../../services/items/index.js';

type Params = {
    itemId: number;
};

export const getMetadataUseCase = async ({ itemId }: Params) => {
    const item = await getMetadata({ itemId });

    if (!item) {
        throw new AppError('ITEM_NOT_FOUND', 404);
    }

    return item;
};
