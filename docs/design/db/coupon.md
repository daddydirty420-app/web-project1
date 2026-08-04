## coupon

クーポン系テーブルの中核。クーポン本体。

### discount_type

```typescript
discount_type: {
    type: DataTypes.ENUM("fixed", "percent", "free_shipping"),
    allowNull: false,
},
```

マスターテーブルも検討したけど、種類がほとんど増えない想定なのでENUMを採用。

DB側で制約を掛けられるし、JOINも不要。

将来、種類がかなり増えるようならマスターテーブル化を検討。

### distribution_type

```typescript
distribution_type: {
    type: DataTypes.ENUM("public", "manual", "campaign"),
    allowNull: false,
    defaultValue: "public",
},
```

公開クーポン、手動クーポン（こっちが指定したユーザーに配る）の2つがあればとりあえずいいし、キャンペーンクーポンは公開クーポンと役割被る気がしなくも無いけど、なにかのキャンペーンのときに配るときは"campaign"、そうでなくてふつうに配るときは"public"かな？

### status

```typescript
status: {
    type: DataTypes.ENUM("active", "stopped"),
    allowNull: false,
    defaultValue: "active",
},
```

運用方法についてはまだ議論の余地あって、終了したクーポンはアーカイブテーブルでも作っちゃおうかなっていう手もあるけど、いったんはstatusの"active"と"stopped"を切り替えるっていう最小構成でやってみる。

### admin_id系

```typescript
created_admin_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: "user",
        key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
},
updated_admin_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: "user",
        key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
},
```

管理者削除時にSET NULLも考えたけど、

- 誰が作成・更新したかを保証したい
- 管理者は安易に削除されるべきではない

ためRESTRICTを採用した。

## coupon_user

ユーザー所持クーポン。中間テーブル。例えば、3番ユーザーは1番クーポン持ってる、4番ユーザーは7番クーポン持ってるみたいな感じ。

### 日時系カラム

```typescript
received_at: {
    type: DataTypes.DATE,
    allowNull: false,
},
expires_at: {
    type: DataTypes.DATE,
    allowNull: false,
},
used_at: {
    type: DataTypes.DATE,
    allowNull: true,
},
```

受け取り日時、有効期限、使用日時があればいいかな？って感じ。使用日時だけ使うまでnullだからnullableにした。

## coupon_item, coupon_shop, coupon_category

item, shop, category専門クーポン用中間テーブル。

### 複合index

```typescript
indexes: [
    {
        unique: true,
        fields: ["coupon_id", "item_id"],
        name: "uq_coupon_item_coupon_id_item_id",
    },
],
```

coupon_itemの例。

禁止

- coupon1 → item1
- coupon1 → item1

許可

- coupon1 → item1
- coupon1 → item2
- coupon1 → item1
- coupon2 → item1

いつもの単体uniqueでやろうと思ったけど無理だったから、複合index使った。😅

## purchase_session, orders

### coupon_user_id

```typescript
coupon_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
        model: "coupon_user",
        key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
},
```

ほとんどの場合クーポン使わないから、nullableにしないと死ぬ😅

couponはuserが使うもので、user所持クーポンは使うごとに減るから、coupon_userとリレーションしてる。

purchase_session

- 編集途中のデータ
- 同じクーポンを付け直す可能性がある

unique無し。

orders

- 購入確定データ
- 同じクーポンを2度使われたら不正利用

uniqueつけた。

---

## 将来見直すかもしれない

- campaignを残すか
- クーポン複数枚利用
- アーカイブテーブル化
- 送料無料クーポンの仕様
