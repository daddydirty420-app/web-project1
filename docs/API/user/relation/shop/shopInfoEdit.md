# user/relation/shop/shopInfoEdit.md

## POST /shop-info-edit/address/:id — 会社所在地変更受付

### リクエスト

- params:
    - shopId
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
- お知らせ作成（非同期）

---

## POST /shop-info-edit/bank-account/:id — 口座情報変更受付

### リクエスト

- params:
    - shopId
- body:
    - bankName
    - branch
    - accountType
    - accountNumber
    - meigi

### ビジネスロジック

- 銀行名照合
- 支店名照合
- 口座種別マスター照合
- ShopInfoEdit作成
- 口座情報作成
- お知らせ作成（非同期）

---
