import { destroyExpiredRefreshTokens } from "../../services/refreshTokens.js";

export const deleteCronRefreshTokensUseCase = (): Promise<number> => {
    return destroyExpiredRefreshTokens({ expiredBefore: Date.now() });
};
