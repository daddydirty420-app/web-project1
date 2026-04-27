# orders/ordersList.md

## GET /orders?type=purchased — 購入履歴取得

### リクエスト

- query:
    - type=purchased
    - page
    - status

### ビジネスロジック

- where status判定
- 購入履歴（orders）取得
    - 購入履歴
    - ページ数カウント

### レスポンス

- ordersList
- totalPages

---

## GET /orders?type=sold — 販売履歴取得

### リクエスト

- query:
    - type=sold
    - page
    - status

### ビジネスロジック

- where status判定
- 販売履歴（orders）取得
    - 販売履歴
    - ページ数カウント

### レスポンス

- ordersList
- totalPages

---