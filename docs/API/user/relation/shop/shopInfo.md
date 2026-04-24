# user/relation/shop/shopInfo.md

## PATCH /shop-info/rep-name/:id — 代表者氏名変更

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
- ショップデータ更新
- 代表者氏名データ更新

---

## PATCH /shop-info/phone-number — 電話番号更新

### リクエスト

- body:
    - phoneNumber

### ビジネスロジック

- 電話番号バリデーションチェック
- ショップデータ取得
- ユーザー情報取得
- DB更新
    - ショップ更新
    - ユーザー更新

---

## PATCH /shop-info/option/:id — オプション更新

### リクエスト

- body:
    - authTrans
    - openInfo

### ビジネスロジック

- ショップデータ取得
- DB更新
