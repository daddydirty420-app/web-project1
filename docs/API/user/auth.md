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