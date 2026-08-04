## 概要

ordersテーブルの coupon_user_id カラムに unique: true 制約を新たにつけたので、変更を反映するマイグレーションファイルを作成してください。

## modelファイルの場所

/server/src/models/orders.ts

## ルール

/server/migrations配下のAGENTS.mdに書いてあるルールに即して、migrationファイルを作成してください。いかに指定する変更箇所以外の変更はしないでください。

## 変更箇所

ordersテーブル

```ts
coupon_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    unique: true, // ← ここだけ！
    references: {
        model: "coupon_user",
        key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
},
```

unique制約のみ足してくれればOKです！

## 最後にセルフレビュー

実装後に以下をセルフチェックしてください。

- Modelとの差分がないか
- downで完全に元へ戻せるか
- uniqueの変更箇所と違う変更がなされていないか
