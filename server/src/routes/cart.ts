import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express-serve-static-core';
import { authenticateToken } from '../middleware/index.js';
import { deleteCartUseCase } from '../usecases/cart/delete.js';
import { addCartUseCase } from '../usecases/cart/add.js';
import { cartStatusUseCase } from '../usecases/cart/status.js';

const router = Router();

// POST /cart/:id
router.post('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await addCartUseCase({ itemId, userId });

        res.status(200).json({ message: 'カートに追加しました' });
    } catch (err) {
        next(err);
    }
});

// DELETE /cart/:id
router.delete('/:id', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        await deleteCartUseCase({ itemId, userId });

        res.status(200).json({ message: 'カートから削除しました' });
    } catch (err) {
        next(err);
    }
});

// GET /cart/:id/status
router.get('/:id/status', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const itemId = Number(req.params.id);

    const userId = req.user!.id;

    try {
        const status = await cartStatusUseCase({ itemId, userId });

        res.status(200).json({ status });
    } catch (err) {
        next(err);
    }
});

export default router;
