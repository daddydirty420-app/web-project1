import type {
    NextFunction,
    Request,
    Response,
} from "express-serve-static-core";
import { AppError } from "../../errors.js";
import { addPenaltyUseCase } from "../../usecases/admin/users/addPenalty.js";
import { deleteUriageUseCase } from "../../usecases/admin/users/deleteUriage.js";
import { deleteUserAdminUseCase } from "../../usecases/admin/users/deleteUser.js";
import { getAdminProfileUseCase } from "../../usecases/admin/users/getProfile.js";
import { DeleteReasonBody } from "../../validators/body/admin/admin.js";
import {
    AddPenaltyBody,
    DeleteUriageBody,
} from "../../validators/body/admin/users.js";

// DELETE /admin/user/:id
// summary: ユーザー強制削除
// page: /profile/admin/[id]
export const adminUserAdminDeleteByIdController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const pageUserId = Number(req.params.id);
        const adminId = req.user!.id;

        const body = req.validatedBody as DeleteReasonBody;

        const deleteReason = body.deleteReason;
        if (!deleteReason.trim()) {
            throw new AppError("INVALID_BODY_EMPTY", 400);
        }

        try {
            await deleteUserAdminUseCase({ pageUserId, adminId, deleteReason });

            res.status(200).json({ message: "ユーザーを削除しました。" });
        } catch (err) {
            next(err);
        }
    };

// PATCH /admin/user/:id/add-penalty
// summary: ペナルティポイント追加
// page: /profile/admin/[id]
export const adminUserAdminPatchByIdAddPenaltyController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const pageUserId = Number(req.params.id);

        const body = req.validatedBody as AddPenaltyBody;
        const addPenalty = body.addPenalty;

        try {
            await addPenaltyUseCase({ pageUserId, addPenalty });

            res.status(200).json({ message: "ペナルティポイントを追加しました。" });
        } catch (err) {
            next(err);
        }
    };

// PATCH /admin/user/:id/delete-uriage
// summary: 売上金没収
// page: /profile/admin/[id]
export const adminUserAdminPatchByIdDeleteUriageController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const pageUserId = Number(req.params.id);

        const body = req.validatedBody as DeleteUriageBody;

        const deleteUriage = body.deleteUriage;

        try {
            await deleteUriageUseCase({ pageUserId, deleteUriage });

            res.status(200).json({
                message: "売上金没収処理が完了しました",
                deleteUriage,
            });
        } catch (err) {
            next(err);
        }
    };

// GET /admin/user/:id/profile
// summary: 管理者用プロフィールページ データ取得
// page: /profile/admin/[id]
export const adminUserAdminGetByIdProfileController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const pageUserId = Number(req.params.id);

        try {
            const user = await getAdminProfileUseCase({ pageUserId });

            res.status(200).json({ user });
        } catch (err) {
            next(err);
        }
    };
