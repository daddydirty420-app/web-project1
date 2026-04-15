# item/recommendList.md

## GET /items/recommend (recommend) — トップレコメンド取得

### リクエスト
- query:
  - view=recommend

### ビジネスロジック
- 商品一覧を取得

### レスポンス
- items

---

## GET /items/recommend (cart) — カートレコメンド取得

### リクエスト
- query:
  - view=cart

### ビジネスロジック
- 商品一覧を取得

### レスポンス
- items

---

## GET /items/recommend (itemPage) — 商品ページレコメンド取得

### リクエスト
- query:
  - view=itemPage
  - itemId=0

### ビジネスロジック
- 商品一覧を取得

### レスポンス
- items