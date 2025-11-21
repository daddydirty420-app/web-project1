import { Router, Request, Response } from "express";
import { authenticateToken, authenticateOptional } from "../middleware/index.js";
import { User, Item, ShopInfo, Address, Name, ReccomendMonth, BankAccount, IdCard, Notification, ReferenceCode, Video, Sale, AccountTypeOption, UriagekinHistory } from "../models/index.js";
import { Op } from "sequelize";

const router = Router();

router.get('/me', authenticateOptional, async (req: Request, res: Response): Promise<void> => {
  res.json({ currentUserId: req.user?.id ?? null });
});

router.get('/me-admin', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    res.json({ admin: !!req.user.admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
});

router.get('/inquiry', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await User.findByPk(req.user!.id, {
      attributes: ['id', 'user_name', 'email']
    });

    if (!data) {
      res.status(404).json({ message: 'データが見つかりません。' });
      return;
    }

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラーが発生しました。'});
  }
});

router.get('/profile/:id', async (req: Request, res: Response): Promise<void> => {
  const userId = req.params.id;

  const page = parseInt(req.query.page as string) || 1;
  const limit = Number(req.query.limit) || 6;
  const offset = (page - 1) * limit;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['user_name', 'user_introduction', 'profile_image', 'early_seller', 'honnin_verified', 'star_amount', 'star_average'],
      include: [
        {
          model: ShopInfo,
          where: { verified: true },
          attributes: ['id']
        }
      ]
    });

    if (!user) {
      res.status(404).json({ message: 'ユーザーが見つかりません。' });
      return;
    }

    const hasShop = !!user.ShopInfo;
    
    const items = await Item.findAll({
      attributes: ['id', 'name', 'price', 'public', 'sold_out', 'uploaded_date', 'seller_id'],
      where: {
        public: true,
        seller_id: userId
      },
      limit,
      offset,
      order: [['uploaded_date', 'DESC']],
      include: [
        {
          model: Video,
          attributes: ['thumbnail_url', 'title', 'duration']
        },
        {
          model: Sale,
          attributes: ['sale_flag', 'before_price', 'discount_rate', 'discount_amount']
        }
      ]
    });
    
    const hasItemCount = await Item.count({
      where: {
        public: true,
        seller_id: userId
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
    console.error(err);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
});

router.get('/star/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: ['star_average'],
    });

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
});

router.get('/profile/metadata/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const userData = await User.findByPk(req.params.id, {
      attributes: ['user_name', 'user_introduction'],
    });

    res.status(200).json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
});

router.get('/my-page/ssr', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const currentUserId = req.user!.id;

  try {
    const user = await User.findByPk(currentUserId, {
      attributes: ['id', 'user_name', 'profile_image', 'early_seller', 'honnin_verified', 'points', 'uriagekin'],
      include: [
        {
          model: ShopInfo,
          where: { verified: true },
          attributes: ['id'],
        }
      ]
    });

    const hasShop = !!user.ShopInfo;

    const itemCount = await Item.count({ where: { seller_id: currentUserId, public: true } });
    const soldItemCount = await Item.count({
      where: {
        seller_id: currentUserId,
        sold_out: true
      }
    });

    const unreadCount = await Notification.count({
      where: {
        read_user_id: req.user!.id,
        read_flag: false
      }
    });
    
    const referenceCount = await ReferenceCode.count({
      where: {
        output_user_id: currentUserId,
        checked: true
      }
    });

    res.status(200).json({
      userData: {
        user,
        hasShop
      },
      itemCount,
      soldItemCount,
      unreadCount,
      referenceCount,      
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
});

router.get('/transfar-request', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  try {
    const user = await User.findByPk(req.user!.id, {
      attributes: ['id', 'uriagekin'],
      include: [
        {
          model: ReccomendMonth,
          attributes: ['id'],
        },
        {
          model: BankAccount,
          attributes: ["id", "bank_name", "branch", "account_type_id", "account_number", "meigi"],
          include: [
            {
              model: AccountTypeOption,
            },
          ],
        },
      ],
    });

    if (!user) {
      res.status(404).json({ message: 'データが見つかりません。' });
      return;
    }

    let minValue = 0;

    if (user.ReccomendMonth) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 999);

      const histories = await UriagekinHistory.findAll({
        where: {
          user_id: userId,
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
        attributes: ["uriagekin"],
      });

      const totalUriagekin = histories.reduce((sum: number, h: any) => sum + Number(h.uriagekin || 0), 0);

      minValue = Math.min(totalUriagekin, 880);
    }

    res.json({ user, minValue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
});

router.get('/transfar-points', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  const userId = req.user!.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'points', 'uriagekin'],
      include: [
        {
          model: ReccomendMonth,
          attributes: ["id"],
        },
      ],
    });

    if (!user) {
      res.status(404).json({ message: 'データが見つかりません。' });
      return;
    }

    let minValue = 0;

    if (user.ReccomendMonth) {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 999);

      const histories = await UriagekinHistory.findAll({
        where: {
          user_id: userId,
          createdAt: {
            [Op.between]: [startOfMonth, endOfMonth],
          },
        },
        attributes: ["uriagekin"],
      });

      const totalUriagekin = histories.reduce((sum: number, h: any) => sum + Number(h.uriagekin || 0), 0);

      minValue = Math.min(totalUriagekin, 880);
    }

    res.json({ user, minValue });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'サーバーエラーが発生しました。'});
  }
});

export default router;