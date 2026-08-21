import { describe, expect, it } from "vitest";
import {
    createBuyerRefundBankSnapshot,
    createBuyerRefundNotificationMessage,
} from "../../../../src/usecases/admin/users/deleteUserRefund.js";

const unregisteredMessage = "口座情報が未登録です。至急口座を登録してください。";

describe("deleteUserRefund", () => {
    it("購入者の口座から返金用スナップショットを作成する", () => {
        const snapshot = createBuyerRefundBankSnapshot({
            bank_name: "購入者銀行",
            branch: "購入者支店",
            account_type: "ordinary",
            account_number: "1234567",
            meigi: "コウニュウシャ",
        });

        expect(snapshot).toEqual({
            bank_name: "購入者銀行",
            branch_name: "購入者支店",
            account_type: "ordinary",
            account_number: "1234567",
            meigi: "コウニュウシャ",
        });
        expect(
            createBuyerRefundNotificationMessage({ itemName: "商品", buyerHasAccount: true }),
        ).not.toContain(unregisteredMessage);
    });

    it("購入者の口座が未登録の場合は空のスナップショットと登録案内を作成する", () => {
        expect(createBuyerRefundBankSnapshot()).toEqual({
            bank_name: "",
            branch_name: "",
            account_type: "",
            account_number: "",
            meigi: "",
        });
        expect(
            createBuyerRefundNotificationMessage({ itemName: "商品", buyerHasAccount: false }),
        ).toContain(unregisteredMessage);
    });

    it("複数注文では注文ごとの購入者口座から個別のスナップショットを作成する", () => {
        const snapshots = [
            {
                bank_name: "第一銀行",
                branch: "第一支店",
                account_type: "ordinary" as const,
                account_number: "1111111",
                meigi: "ダイイチ",
            },
            {
                bank_name: "第二銀行",
                branch: "第二支店",
                account_type: "checking" as const,
                account_number: "2222222",
                meigi: "ダイニ",
            },
        ].map(createBuyerRefundBankSnapshot);

        expect(snapshots[0]).toMatchObject({ bank_name: "第一銀行", account_number: "1111111" });
        expect(snapshots[1]).toMatchObject({ bank_name: "第二銀行", account_number: "2222222" });
    });
});
