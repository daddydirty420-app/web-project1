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
