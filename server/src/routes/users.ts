import { Router } from "express";
import type { NextFunction, Request, Response } from "express-serve-static-core";
import { authenticateToken, authenticateOptional } from "../middleware/index.js";
import { User, Item, ShopInfo, BankAccount, Notification, ReferenceCode, Video, Sale, AccountTypeOption, UriagekinHistory } from "../models/index.js";
import { Op } from "sequelize";

const router = Router();

router.get('/me', authenticateOptional, async (req: Request, res: Response): Promise<void> => {
  res.json({ currentUserId: req.user?.id ?? null });
});

router.get('/me-admin', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  res.json({ admin: !!req.user!.admin });
});

router.get('/profile/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.params.id;

  const page = parseInt(req.query.page as string) || 1;
  const limit = Number(req.query.limit) || 6;
  const offset = (page - 1) * limit;

  try {
    const user = await User.findByPk(userId, {
      attributes: ["id", 'user_name', 'user_introduction', 'profile_image', 'early_seller', 'honnin_verified', 'star_amount', 'star_average'],
      include: [
        {
          model: ShopInfo,
          where: { verified: true },
          attributes: ['id'],
          required: false,
        }
      ]
    });

    if (!user) {
      res.status(404).json({ message: 'ユーザーが見つかりません。' });
      return;
    }

    const hasShop = !!user.ShopInfo;
    
    const items = await Item.findAll({
      attributes: ['id', 'name', 'price', "status", 'uploaded_at', 'seller_id'],
      where: {
        status: { [Op.in]: ["active", "soldout"] },
        seller_id: userId,
      },
      limit,
      offset,
      order: [['uploaded_at', 'DESC']],
      include: [
        {
          model: Video,
          attributes: ['thumbnail_url', 'title', 'duration'],
        },
        {
          model: Sale,
          attributes: ['sale_flag', 'before_price', 'discount_rate', 'discount_amount'],
        }
      ]
    });
    
    const hasItemCount = await Item.count({
      where: {
        status: { [Op.in]: ["active", "soldout"] },
        seller_id: userId,
      }
    }) ?? 0;
            
    const totalPages = Math.ceil(hasItemCount / limit);

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

router.get('/star/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['star_average'],
    });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
});

router.get('/profile/metadata/:id', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userData = await User.findByPk(req.params.id, {
      attributes: ['user_name', 'user_introduction'],
    });

    res.status(200).json({ userData });
  } catch (err) {
    next(err);
  }
});

router.get('/my-page/ssr', authenticateToken, async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const currentUserId = req.user!.id;

  try {
    const user = await User.findByPk(currentUserId, {
      attributes: ['id', 'user_name', 'profile_image', 'early_seller', 'honnin_verified', 'points', 'uriagekin'],
      include: [
        {
          model: ShopInfo,
          where: { verified: true },
          attributes: ['id'],
          required: false,
        }
      ]
    });

    if (!user) {
      res.status(404).json({ message: "ユーザーが見つかりません" });
      return;
    }

    const hasShop = !!user.ShopInfo;

    const itemCount = await Item.count({
      where: { 
        seller_id: currentUserId,
        status: { [Op.in]: ["active", "soldout"] },
      }
    });

    const soldItemCount = await Item.count({
      where: {
        seller_id: currentUserId,
        status: "soldout",
      },
    });

    const unreadCount = await Notification.count({
      where: {
        read_user_id: req.user!.id,
        read_flag: false,
      },
    });
    
    const referenceCount = await ReferenceCode.count({
      where: {
        output_user_id: currentUserId,
        checked: true,
      },
    });

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