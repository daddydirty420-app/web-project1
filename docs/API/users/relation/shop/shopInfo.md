# user/relation/shop/shopInfo.md

## POST /shop-info — ショップ作成

### リクエスト

- body

### ビジネスロジック

- 空チェック
- トリム
- 住所バリデーションチェック
- 代表者・担当者氏名作成
- ショップデータ作成
- 住所作成

### レスポンス

- shopId

---

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
- 旧身分証削除
- ショップデータ更新
- 代表者氏名データ更新

### レスポンス

- frontSignedUrl
- rearSignedUrl

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

---

## PATCH /shop-info/signup/3/:id — ショップ登録身分証・許認可証追加

### リクエスト

- params:
    - shopId
- body:
    - frontFileName
    - frontFileType
    - rearFileName
    - rearFileType
    - idFrontUpload
    - idRearUpload
    - permitFiles

### ビジネスロジック

- 空チェック
- ショップデータ取得
- 身分証アップロード
- 旧身分証削除
- 許認可証アップロード
- 旧許認可証削除
- ショップデータ更新

### レスポンス

- frontSignedUrl
- rearSignedUrl
- permitSignedUrls

---

## PATCH /shop-info/signup/4/:id — ショップ登録オプション設定

### リクエスト

- params:
    - shopId
- body:
    - authTrans
    - openInfo

### ビジネスロジック

- ショップデータ取得
- DB更新

---

## PATCH /shop-info/signup/edit/:id — ショップ登録確認ページ編集

### リクエスト

- params:
    - shopId
- body（any）

### ビジネスロジック

- ショップデータ取得
- DB更新

---

## PATCH /shop-info/signup/5/:id — ショップ登録確定

### リクエスト

- params:
    - shopId

### ビジネスロジック

- ショップデータ取得
- 既存未承認ショップデータ取得
- 未承認ショップデータ・関連データ削除
- DB更新
- メール送信
