# orders/relation/delivery.md

## POST /delivery/:id — 配送データ作成

### リクエスト

- params:
    - itemId

### ビジネスロジック

- ユーザー情報取得
- 商品データ取得
- 住所・氏名取得
- 配送データ作成
- 住所データ作成
- 氏名データ作成

### レスポンス

- deliveryId
