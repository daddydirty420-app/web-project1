import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken, authenticateOptional } from "../middleware/index.js";
import { User, BankAccount, AccountTypeOption } from "../models/index.js";
import { getProfileMetadata, getStar } from "../services/users.js";
import { getProfileUseCase } from "../usecases/user/getProfile.js";
import { getMyPageUseCase } from "../usecases/user/getMyPage.js";

const router = Router();

router.get('/me', authenticateOptional, async (req: Request, res: Response): Promise<void> => {
  res.json({ currentUserId: req.user?.id ?? null });
});

router.get('/me-admin', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  res.json({ admin: !!req.user!.admin });
});

// GET /:id/profile
router.get('/:id/profile', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = Number(req.params.id);

  const page = parseInt(req.query.page as string) || 1;
  const limit = Number(req.query.limit) || 6;

  try {
    const {
      user,
      hasShop,
      items,
      hasItemCount,
      totalPages
    } = await getProfileUseCase({ userId, page, limit });

    res.status(200).json({
      user,
      hasShop,
      itemList: {
        items,
        hasItemCount,
        totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /user/:id/star
router.get('/:id/star', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = Number(req.params.id);

  try {
    const user = await getStar({ userId });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

// GET /user/:id/profile/metadata
router.get('/:id/profile/metadata', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = Number(req.params.id);

  try {
    const user = await getProfileMetadata({ userId });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

// GET /user/my-page
router.get('/my-page', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.user!.id;

  try {
    const {
      user,
      hasShop,
      itemCount,
      soldItemCount,
      unreadCount,
      referenceCount
    } = await getMyPageUseCase({ userId });

    res.status(200).json({
      userData: {
        user,
        hasShop,
      },
      itemCount,
      soldItemCount,
      unreadCount,
      referenceCount,      
    });
  } catch (err) {
    next(err);
  }
});

router.get('/transfer-request', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.user!.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'uriagekin'],
      include: [
        {
          model: BankAccount,
          attributes: ["id", "bank_name", "branch", "account_type_id", "account_number", "meigi"],
          include: [
            { model: AccountTypeOption },
          ],
        },
      ],
    });

    if (!user) {
      res.status(404).json({ message: 'ユーザーが見つかりません。' });
      return;
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

router.get('/transfer-points', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.user!.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'points', 'uriagekin'],
    });

    if (!user) {
      res.status(404).json({ message: 'ユーザーが見つかりません。' });
      return;
    }

    res.json({ user });
  } catch (err) {
    next(err);
  }
});

export default router;