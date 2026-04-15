# item/openList.md

## GET /items (index/video) — トップ動画一覧取得

### リクエスト
- query:
  - type=video
  - view=index
  - page
  - limit

### ビジネスロジック
- 動画一覧を取得
- ページネーション適用

### レスポンス
- items
- totalPages

---

## GET /items (index/item) — トップ商品一覧取得

### リクエスト
- query:
  - type=item
  - view=index
  - page
  - limit

### ビジネスロジック
- 商品一覧を取得
- ページネーション適用

### レスポンス
- items
- totalPages

---

## GET /items (profile/video) — プロフィール動画一覧取得

### リクエスト
- query:
  - type=video
  - view=profile
  - page
  - limit

### ビジネスロジック
- 動画一覧を取得
- ページネーション適用

### レスポンス
- items
- totalPages

---

## GET /items (profile/item) — プロフィール商品一覧取得

### リクエスト
- query:
  - type=item
  - view=profile
  - page
  - limit

### ビジネスロジック
- 商品一覧を取得
- ページネーション適用

### レスポンス
- items
- totalPages