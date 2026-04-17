# item/deleteItem.md

## PATCH /items/:id/sort-number/add — sort_number追加（非同期）

### リクエスト

- params:
    - itemId
- query:
    - number

### ビジネスロジック

- 商品情報取得
- 新sort_number計算
- 新sort_buzz_number計算
- 商品テーブル更新（非同期）

---

## PATCH /items/:id/sort-number/decrease — sort_number追加（非同期）

### リクエスト

- params:
    - itemId
- query:
    - number

### ビジネスロジック

- 商品情報取得
- 新sort_number計算
- 新sort_buzz_number計算
- 商品テーブル更新（非同期）

---

## PATCH /items/:id/logs/access — アクセスログ作成（非同期）

### リクエスト

- params:
    - itemId

### ビジネスロジック

- 商品情報取得
- 閲覧履歴作成・更新（非同期）
- 閲覧回数+1
- sort_number, sort_buzz_number計算
- 商品テーブル更新（非同期）
