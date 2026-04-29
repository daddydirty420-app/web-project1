# items/relation/sale.md

## PATCH /sale/:id/edit — セール開始

### リクエスト

- params:
    - saleId
- body:
    - discountRate
    - discountAmount
    - finalPrice

### ビジネスロジック

- bodyバリデーションチェック
- セールデータ取得
- 商品データ取得
- セールデータ更新
- 商品データ更新

---

## PATCH /sale/:id/edit — セール終了

### リクエスト

- params:
    - saleId

### ビジネスロジック

- セールデータ取得
- 商品データ取得
- セールデータ更新
- 商品データ更新
