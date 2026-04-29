# user/relation/name.md

## PATCH /name/:id — 氏名変更

### リクエスト

- params:
    - nameId
- body:
    - sei
    - mei
    - seiKana
    - meiKana

### ビジネスロジック

- 空チェック
- トリム
- 氏名データ取得
- DB更新

---

## GET /name/myname — 氏名データ取得

### ビジネスロジック

- 氏名データ取得

### レスポンス

- data(氏名)

---

## GET /name/:id/delivery-name — 配送用氏名データ取得

### リクエスト

- params
    - deliveryId

### ビジネスロジック

- 氏名データ取得

### レスポンス

- data(氏名)
