# junctionTables/itemLike.md

## POST /item-like/:id — いいね作成

### リクエスト

- params:
    - itemId

### ビジネスロジック

- いいねデータ取得
- いいねデータ作成
- sort_number追加（非同期）

---

## DELETE /item-like/:id — いいね削除

### リクエスト

- params:
    - itemId

### ビジネスロジック

- いいねデータ取得
- いいねデータ削除
- sort_number減少（非同期）

---

## GET /item-like/:id/user — いいねしたユーザーリスト取得

### リクエスト

- params:
    - itemId
- query:
    - keyword

### ビジネスロジック

- いいねリスト取得
- フォロー状態の付与
- ユーザー情報マップ化

### レスポンス

- userList
