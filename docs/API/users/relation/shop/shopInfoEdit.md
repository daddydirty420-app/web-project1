# user/relation/shop/shopInfoEdit.md

## POST /shop-info-edit/:id/address — 会社所在地変更受付

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

## POST /shop-info-edit/:id/bank-account — 口座情報変更受付

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

## POST /shop-info-edit/:id/rep-name — 代表者氏名変更受付

### リクエスト

- params:
    - shopId
- body:
    - seiValue
    - meiValue
    - seiKanaValue
    - meiKanaValue
    - frontFileName
    - frontFileType
    - rearFileName
    - rearFileType
    - idFrontUpload
    - idRearUpload

### ビジネスロジック

- 空チェック
- トリム
- ショップデータ取得
- 身分証アップロード
- 旧身分証削除
- ShopInfoEdit作成
- 代表者氏名データ作成
- お知らせ作成（非同期）

### レスポンス

- frontSignedUrl
- rearSignedUrl

---

## POST /shop-info-edit/:id/company-name — 会社名変更受付

### リクエスト

- params:
    - shopId
- body:
    - companyName

### ビジネスロジック

- ショップデータ取得
- 法人
    - ShopInfoEdit作成
    - お知らせ作成（非同期）
- 個人
    - ショップDB更新

---

## POST /shop-info-edit/:id/com-free — 事業形態変更受付

### リクエスト

- params:
    - shopId
- body:
    - selectOption（comFreeId）

### ビジネスロジック

- ショップデータ取得
- 代表者氏名データ作成
- 担当者氏名データ作成
- ShopInfoEdit作成
- 住所データ作成
- 口座番号データ作成

### レスポンス

- editId

---

## PATCH /shop-info-edit/:id — ShopInfoEditカラム変更

### リクエスト

- params:
    - shopEditId
- body

### ビジネスロジック

- ShopInfoEdit取得
- DB更新

---

## PATCH /shop-info-edit/:id/id-image-upload — 事業者登録　代表者身分証アップロード

### リクエスト

- params:
    - shopEditId
- body

### ビジネスロジック

- body空チェック
- ShopInfoEdit取得
- 代表者身分証アップロード
- 許認可証アップロード
- DB更新
- メール送信
- お知らせ作成（非同期）

### レスポンス

- frontSignedUrl
- rearSignedUrl
- permitSignedUrl
