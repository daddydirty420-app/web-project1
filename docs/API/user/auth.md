# user/auth.md

## POST /auth/login — ログイン

### リクエスト

- body:
    - email
    - password
    - rememberMe

### ビジネスロジック

- emailユーザー照合
- passwordユーザー照合
- アクセストークン・リフレッシュトークン生成
- 旧リフレッシュトークン削除
- 新リフレッシュトークンDB登録
- クッキー登録

### レスポンス

- id
- email
- user_name
- admin
- rememberMe
- accessToken
- refreshToken

---

## POST /auth/signup — 会員登録

### リクエスト

- body:
    - email
    - password

### ビジネスロジック

- emailユーザー照合
- passwordバリデーションチェック
- passwordハッシュ化
- ユーザーネーム生成
- 認証コード作成
- ユーザー作成
- 認証コードDB登録
- 認証ページurl生成
- メール送信

### レスポンス

- expiresAt
- reissueUrl

---

## POST /auth/resend-verification-code — 認証コード再発行

### リクエスト

- body:
    - token

### ビジネスロジック

- トークン照合
- 新しいトークン発行
- DB更新
- メール送信

### レスポンス

- expiresAt
- reissueUrl

---

## POST /auth/signup-verify —サインアップコード認証

### リクエスト

- body:
    - verificationCode
    - rememberMe

### ビジネスロジック

- 認証コード照合
- ユーザー情報取得
- アクセストークン・リフレッシュトークン発行
- ユーザー情報更新
- リフレッシュトークンDB登録
- 住所・氏名・口座情報・身分証明書　DB作成
- 認証コード削除

### レスポンス

- id
- email
- user_name
- admin
- rememberMe
- accessToken
- refreshToken

---
