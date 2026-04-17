import { countFollowBoth } from '../../services/follow.js';
import { AppError } from '../../errors.js';

type Params = {
    userId: number;
};

export const countFollowUseCase = async ({ userId }: Params) => {
    const { followCount, followerCount } = await countFollowBoth({ userId });

    if (followCount === null || followerCount === null) {
        throw new AppError('NUMBER_NOT_FOUND', 404);
    }

    return { followCount, followerCount };
};
