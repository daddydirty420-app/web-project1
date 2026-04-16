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