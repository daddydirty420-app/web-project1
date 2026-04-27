# item/userItems.md

## GET /users/me/items (cart) — カートリスト取得

### リクエスト

- query:
    - type=cart
    - page
    - keyword

### ビジネスロジック

- 商品一覧を取得
- ページネーション適用

### レスポンス

- items
- totalPages

---

## GET /users/me/items (deleted) — 削除した商品リスト取得

### リクエスト

- query:
    - type=deleted
    - page
    - keyword

### ビジネスロジック

- 商品一覧を取得
- ページネーション適用

### レスポンス

- items
- totalPages

---

## GET /users/me/items (draft) — 下書き商品リスト取得

### リクエスト

- query:
    - type=draft
    - page
    - keyword

### ビジネスロジック

- 商品一覧を取得
- ページネーション適用

### レスポンス

- items
- totalPages

---

## GET /users/me/items (like) — いいねした商品取得

### リクエスト

- query:
    - type=like
    - page
    - keyword

### ビジネスロジック

- 商品一覧を取得
- ページネーション適用

### レスポンス

- items
- totalPages

---

## GET /users/me/items (stock) — 在庫数リスト取得

### リクエスト

- query:
    - type=stock
    - page
    - keyword

### ビジネスロジック

- 商品一覧を取得
- ページネーション適用

### レスポンス

- items
- totalPages

---

## GET /users/me/items (uploaded) — 出品した商品リスト取得

### リクエスト

- query:
    - type=uploaded
    - page
    - keyword
    - status

### ビジネスロジック

- 商品一覧を取得
- ページネーション適用

### レスポンス

- items
- totalPages

---

## GET /users/me/items (watchHistory) — 閲覧履歴取得

### リクエスト

- query:
    - type=watchHistory
    - page
    - keyword

### ビジネスロジック

- 商品一覧を取得
- ページネーション適用

### レスポンス

- items
- totalPages
