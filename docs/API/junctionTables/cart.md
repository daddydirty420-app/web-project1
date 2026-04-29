# junctionTables/cart.md

## POST /cart/:id — カート作成

### リクエスト

- params:
    - itemId

### ビジネスロジック

- カートデータ取得
- カートデータ作成
- sort_number追加（非同期）

---

## DELETE /cart/:id — カート削除

### リクエスト

- params:
    - itemId

### ビジネスロジック

- カートデータ取得
- カートデータ削除
- sort_number減少（非同期）
