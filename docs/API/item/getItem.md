# item/getItem.md

## GET /items/:id/highlight — 商品情報ハイライト取得

### ビジネスロジック
- 商品情報を取得

### レスポンス
- item

---

## GET /items/:id/form-data — 出品ページ商品情報取得

### ビジネスロジック
- 商品情報を取得
- カテゴリー一覧取得
- 商品の状態マスタ取得
- 発送日マスタ取得
- 配送サービスマスタ取得
- 都道府県マスタ取得
- ユーザー情報（自分） ＋ ショップ情報取得
- ショップユーザーか判定

### レスポンス
- item
- category
- allCondetion
- allDay
- allService
- allPlace
- hasShop