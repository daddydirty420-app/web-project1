# user/edit.md

## PATCH /user/phone-number — 電話番号更新

### リクエスト

- body:
    - phoneNumber

### ビジネスロジック

- 電話番号バリデーションチェック
- ユーザー情報取得
- DB更新

---

## PATCH user/profile?imageEdit=boolean — プロフィール更新

### リクエスト

- body:
    - userName
    - introduction
    - fileName?
    - contentType?
- query
    - imageEdit

### ビジネスロジック

- ユーザー情報取得
- プロフィール画像署名付きURL取得
- DB更新
- ショップユーザー判定・ショップDB更新
- 旧プロフィール画像削除

### レスポンス

- signedUrl

---
