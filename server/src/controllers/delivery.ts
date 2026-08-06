import type {
    NextFunction,
    Request,
    Response,
} from "express-serve-static-core";
import { getDeliveryAddressUseCase } from "../usecases/delivery/getAddress.js";
import { getDeliveryNameUseCase } from "../usecases/delivery/getName.js";
import { postDeliveryBuyUseCase } from "../usecases/delivery/postBuy.js";

// POST /delivery/:id
// summary: 配送データ作成
// page: /item
export const deliveryPostByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const userId = req.user!.id;
        const itemId = Number(req.params.id);

        try {
            const deliveryId = await postDeliveryBuyUseCase({ itemId, userId });

            res.status(200).json({ deliveryId });
        } catch (err) {
            next(err);
        }
    };

// GET /delivery/:id/address
// summary: 配送用住所取得
// page: /edit/address/delivery/[id]
export const deliveryGetByIdAddressController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const deliveryId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            const data = await getDeliveryAddressUseCase({ deliveryId, userId });

            res.status(200).json({ data });
        } catch (err) {
            next(err);
        }
    };

// GET /delivery/:id/name
// summary: 配送用氏名取得
// page: /edit/name/delivery/[id]
export const deliveryGetByIdNameController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const deliveryId = Number(req.params.id);
        const userId = req.user!.id;

        try {
            const name = await getDeliveryNameUseCase({ deliveryId, userId });

            res.status(200).json({ name });
        } catch (err) {
            next(err);
        }
    };
