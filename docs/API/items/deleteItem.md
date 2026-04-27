# item/deleteItem.md

## DELETE /items/:id/logical — 商品データ論理削除

### リクエスト

- params:
    - itemId

### ビジネスロジック

- 商品情報取得
- 関連データ（コメント、いいね、カート）取得
- 関連データ（コメント、いいね、カート）削除
- sale更新
- 商品データ論理削除
- お知らせ作成（非同期）

---

## DELETE /items/:id/perfect — 商品データ完全削除

### リクエスト

- params:
    - itemId

### ビジネスロジック

- 商品情報取得
- 商品削除ログ作成
- 商品テーブル削除

---

## DELETE /items/:id/draft — 下書き商品データ削除

### リクエスト

- params:
    - itemId

### ビジネスロジック

- 商品情報取得
- 商品テーブル削除

---

## PATCH /items/:id/restore — 商品データ復元

### リクエスト

- params:
    - itemId

### ビジネスロジック

- 商品情報取得
- 商品テーブル更新
- お知らせ作成（非同期）
