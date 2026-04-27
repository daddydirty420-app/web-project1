# orders/ordersList.md

## GET /orders?type=purchased — 購入履歴取得

### リクエスト

- query:
    - type= purchased
    - page
    - status

### ビジネスロジック

- 購入履歴（orders）取得
    - 購入履歴
    - ページ数カウント

### レスポンス

- ordersList
- totalPages

---