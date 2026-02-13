import { Router } from "express";
import type { Request, Response } from "express-serve-static-core";
import { authenticateToken } from "../middleware/index.js";
import { Transfar, BankAccount, AccountTypeOption, User, RecommendMonth, UriagekinHistory, Notification, PointsHistory, Journal, PointConversionLogs } from "../models/index.js";
import sequelize from "../db.js";
import crypto from "crypto";

const router = Router();

router.post("/request-create", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const requestValue = Number(req.body.transValue);
    const transValue = requestValue - 200;
    const limit = Number(req.body.limit);

    if (requestValue < 1000) {
        res.status(400).json({ message: "申請金額は1,000円以上にしてください。" });
        return;
    }
    if (requestValue > limit) {
        res.status(400).json({ message: `申請金額は売上金${limit.toLocaleString()}円以下にしてください。` });
        return;
    }

    const today = new Date();

    const dayOfWeek = today.getDay();

    const daysUntilFriday = (5 - dayOfWeek + 7) % 7;

    const thisFriday = new Date(today);
    thisFriday.setDate(today.getDate() + daysUntilFriday);

    const nextNextFriday = new Date(thisFriday);
    nextNextFriday.setDate(thisFriday.getDate() + 14);

    const t = await sequelize.transaction();

    try {
        const user = await User.findByPk(userId, {
            include: [
                { model: RecommendMonth },
                { model: UriagekinHistory },
            ],
        });
        if (!user) {
            res.status(404).json({ message: "ユーザーが見つかりません。" });
            return;
        }

        const oldUriagekin = user.uriagekin;

        let deleteValue = requestValue;
        const histories = (user.UriagekinHistories || []).sort(
            (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        for (const history of histories) {
            if (deleteValue <= 0) break;

            const available = Number(history.uriagekin);
            const usedUriagekin = Number(history.used_uriagekin) || 0;
            const remain = available - usedUriagekin;

            if (remain <= 0) continue;

            const used = Math.min(remain, deleteValue);

            await history.update({
                used_uriagekin: usedUriagekin + used,
            }, { transaction: t });

            deleteValue -= used;
        }

        await user.update({
            uriagekin: oldUriagekin - requestValue,
        }, { transaction: t });

        const generateTransfarId = async (): Promise<string> => {
            for (let i = 0; i < 5; i++) {
                const id = crypto.randomBytes(11).toString("hex");
                const existing = await Transfar.findOne({ where: { transfar_id: id } });
                if (!existing) return id;
            }
            throw new Error("Failed to generate unique transfar_id after 5 attempts.");
        };

        const transfarId = await generateTransfarId();

        const transfar = await Transfar.create({
            all_money: requestValue,
            handling_charge: 200,
            trans_money: transValue,
            trans_reason_id: 1,
            user_id: userId,
            trans_schedule_date: nextNextFriday,
            transfar_id: transfarId,
        }, { transaction: t });

        await Notification.create({
            read_user_id: userId,
            url: `/transfar/detail/${transfar.id}`,
            message: `${transValue.toLocaleString()}円を振込申請しました。翌々週の金曜日以降に指定された口座までお振込みいたします。詳細はこちらをクリックしてご確認ください。`,
        }, { transaction: t });

        // メール送信

        await t.commit();
        res.status(200).json({
            message: "振込申請が完了しました。",
            transId: transfar.id,
        });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.post("/points-create", authenticateToken, async (req: Request, res: Response): Promise<void> => {
    const userId = req.user!.id;
    const value = Number(req.body.value);
    const limit = Number(req.body.limit);

    if (value === 0) {
        res.status(400).json({ message: "変換金額を1円以上指定してください。" });
        return;
    }

    if (value > limit) {
        res.status(400).json({ message: `変換金額は売上金${limit.toLocaleString()}円以内にしてください。` });
        return;
    }

    const t = await sequelize.transaction();

    try {
        const user = await User.findByPk(userId, {
            include: [
                { model: RecommendMonth },
                { model: UriagekinHistory },
            ],
        });
        if (!user) {
            res.status(404).json({ message: "ユーザーが見つかりません。" });
            return;
        }

        const oldUriagekin = user.uriagekin;
        const oldPoints = user.points;

        let deleteValue = value;
        const histories = (user.UriagekinHistories || []).sort(
            (a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        for (const history of histories) {
            if (deleteValue <= 0) break;

            const available = Number(history.uriagekin);
            const usedUriagekin = Number(history.used_uriagekin) || 0;
            const remain = available - usedUriagekin;

            if (remain <= 0) continue;

            const used = Math.min(remain, deleteValue);

            await history.update({
                used_uriagekin: usedUriagekin + used,
            }, { transaction: t });

            deleteValue -= used;
        }

        await Journal.create({
            kanjyo_kari1: 3,
            kanjyo_kashi1: 8,
            reason_id: 7,
            price_kari1: value,
            price_kashi1: value,
        }, { transaction: t });

        await PointsHistory.create({
            points: value,
            user_id: userId,
        }, { transaction: t });

        await PointConversionLogs.create({
            converted_points: value,
            before_points: oldPoints,
            after_points: oldPoints + value,
            reason: "売上金ポイント変換",
            plus: true,
            user_id: userId,
        }, { transaction: t });

        await user.update({
            points: oldPoints + value,
            uriagekin: oldUriagekin - value,
        }, { transaction: t });

        await Notification.create({
            read_user_id: userId,
            message: `売上金${value.toLocaleString()}円をポイントに変換しました。ポイントは当サイト内のお買い物にご利用いただけます。ポイントの有効期限は本日から180日後です。`,
        }, { transaction: t });

        await t.commit();
        res.status(200).json({ message: "売上金をポイント変換しました。" });
    } catch (err) {
        await t.rollback();
        console.error(err);
        res.status(500).json({ message: "サーバーエラーが発生しました。" });
    }
});

router.get('/detail/:id', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const data = await Transfar.findByPk(req.params.id, {
            attributes: ['id', 'trans_money', 'transfar_id', 'createdAt'],
            include: [
                {
                    model: BankAccount,
                    attributes: ['id', 'bank_name', 'branch_code', 'account_number', 'meigi'],
                    include: [
                        { model: AccountTypeOption },
                    ],
                },
            ],
        });

        if (!data) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

router.get('/history', authenticateToken, async (req: Request, res: Response): Promise<void> => {
    try {
        const dataList = await Transfar.findAll({
            attributes: ['id', 'trans_money', 'trans_finish'],
            where: { user_id: req.user!.id },
            order: [['createdAt', 'DESC']],
        });

        if (!dataList) {
            res.status(404).json({ message: 'データが見つかりません。' });
            return;
        }

        res.json({ dataList });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'サーバーエラーが発生しました。' });
    }
});

export default router;