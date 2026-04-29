# user/relation/address.md

## PATCH /address/:id — 住所変更

### リクエスト

- params:
    - addressId
- body:
    - postNumber
    - todouhuken
    - shikutyouson
    - banchi
    - building

### ビジネスロジック

- 空チェック
- 郵便番号正規化＆バリデーションチェック
- zipCloudフェッチ
- 郵便番号住所一致チェック
- DB更新

---

## GET /address/myaddress — 住所データ取得

### ビジネスロジック

- 住所データ取得

### レスポンス

- data(住所)

---

## GET /address/:id/delivery-address — 配送用住所データ取得

### リクエスト

- params
    - deliveryId

### ビジネスロジック

- 住所データ取得

### レスポンス

- data(住所)

---

## GET /address/search — 郵便番号検索

### リクエスト

- query:
    - zipcode

### ビジネスロジック

- zipCloudフェッチ
- 郵便番号住所一致チェック

### レスポンス

- address
