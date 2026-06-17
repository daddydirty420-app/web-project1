import { AppError } from "../../errors.js";
import { getTransferDetail } from "../../services/transfer.js";
import { maskAccountNumber } from "../../utils/maskAccountNumber.js";

type Params = {
    transId: number;
};

// GET /transfer/:id/detail
// summary: 振込申請詳細表示
// page: /transfer/detail/[id]
export const getTransferDetailUseCase = async ({ transId }: Params) => {
    // データ取得
    const transfer = await getTransferDetail({ id: transId });

    if (!transfer) throw new AppError("TRANSFER_NOT_FOUND", 404);

    return {
        ...transfer,
        bank_snapshot: {
            ...transfer.bank_snapshot,
            account_number: maskAccountNumber({ accountNumber: transfer.bank_snapshot.account_number }),
        },
    };
};
