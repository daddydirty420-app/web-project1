import { Router } from "express";
import { usersMeItemsGetRootController } from "../../../controllers/users/me/items.js";
import { authenticateToken } from "../../../middleware/index.js";
import { validateQuery } from "../../../middleware/validate/validateQuery.js";
import { userItemsListQuerySchema } from "../../../validators/query/userItems.js";

const router = Router();

// /users/me/items?type="typename"(&page=number&status=""&keyword="search")
// summary: ユーザー関連各種商品リスト取得
// page: /item-list/...
router.get("/", authenticateToken, validateQuery(userItemsListQuerySchema), usersMeItemsGetRootController);

export default router;
