🇺🇸 English version: API.en.md

# API

## API設計

- RESTful API
- JSON形式
- 認証: JWT（Bearerトークン）
- ステートレス設計

---

## 認証

- JWT認証を使用
- 保護されたエンドポイントにはアクセストークンが必要
- トークンはAuthorizationヘッダーで送信

- 例:
  - Authorization: Bearer <token>

---

## 主要エンドポイント

* 商品ページ取得

GET /items/:id

* ログイン

POST /auth/login

* 会員登録

POST /auth/signup → POST /auth/signup-verify

* 出品

POST /items → PUT /items/:id?mode=main →　PATCH /items/:id/publish

---

## エラーハンドリング

- エラーはJSON形式で返却
- 主なエラーコード:

AUTH_ERROR
VALIDATION_ERROR
NOT_FOUND
INTERNAL_SERVER_ERROR

---

## 注文ステータス

- pending（支払い待ち）
- paid（支払い済み）
- shipped（発送済み）
- completed（完了）
- cancelled（キャンセル）
- returned（返品）