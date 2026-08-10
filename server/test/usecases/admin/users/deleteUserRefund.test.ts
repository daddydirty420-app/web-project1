import assert from "node:assert/strict";
import test from "node:test";
import {
    createBuyerRefundBankSnapshot,
    createBuyerRefundNotificationMessage,
} from "../../../../src/usecases/admin/users/deleteUserRefund.js";

const unregisteredMessage = "口座情報が未登録です。至急口座を登録してください。";

test("購入者の口座から返金用スナップショットを作成する", () => {
    const snapshot = createBuyerRefundBankSnapshot({
        bank_name: "購入者銀行",
        branch: "購入者支店",
        account_type: "ordinary",
        account_number: "1234567",
        meigi: "コウニュウシャ",
    });

    assert.deepEqual(snapshot, {
        bank_name: "購入者銀行",
        branch_name: "購入者支店",
        account_type: "ordinary",
        account_number: "1234567",
        meigi: "コウニュウシャ",
    });
    assert.equal(
        createBuyerRefundNotificationMessage({ itemName: "商品", buyerHasAccount: true }).includes(
            unregisteredMessage,
        ),
        false,
    );
});

test("購入者の口座が未登録の場合は空のスナップショットと登録案内を作成する", () => {
    assert.deepEqual(createBuyerRefundBankSnapshot(), {
        bank_name: "",
        branch_name: "",
        account_type: "",
        account_number: "",
        meigi: "",
    });
    assert.equal(
        createBuyerRefundNotificationMessage({ itemName: "商品", buyerHasAccount: false }).includes(
            unregisteredMessage,
        ),
        true,
    );
});

test("複数注文では注文ごとの購入者口座から個別のスナップショットを作成する", () => {
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

    assert.equal(snapshots[0].bank_name, "第一銀行");
    assert.equal(snapshots[0].account_number, "1111111");
    assert.equal(snapshots[1].bank_name, "第二銀行");
    assert.equal(snapshots[1].account_number, "2222222");
});
