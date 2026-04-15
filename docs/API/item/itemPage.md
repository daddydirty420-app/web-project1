# item/itemPage.md

## GET /items/:id (normal) — 商品ページ情報取得

### リクエスト
- query:
  - mode=normal

### ビジネスロジック
- 商品情報を取得
- 自分が出品者か判定（sellerMe）
- いいね数カウント
- 自分がいいねしているか判定
- コメント数カウント
- ユーザー情報（自分）を取得

### レスポンス
- items
- sellerMe
- likeCount
- isLikeByMe
- commentCount
- me

---

## GET /items/:id (draft) — 下書き商品ページ情報取得

### リクエスト
- query:
  - mode=draft

### ビジネスロジック
- 商品情報を取得

### レスポンス
- items
- sellerMe: null
- likeCount: null
- isLikeByMe: null
- commentCount: null
- me: null

---

## GET /items/:id (confirm) — 出品確認ページ情報取得

### リクエスト
- query:
  - mode=confirm

### ビジネスロジック
- 商品情報を取得

### レスポンス
- items
- sellerMe: null
- likeCount: null
- isLikeByMe: null
- commentCount: null
- me: null

---

## GET /items/:id (deleted) — 削除した商品ページ情報取得

### リクエスト
- query:
  - mode=deleted

### ビジネスロジック
- 商品情報を取得

### レスポンス
- items
- sellerMe: null
- likeCount: null
- isLikeByMe: null
- commentCount: null
- me: null