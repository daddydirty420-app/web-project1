# GET /user/my-page — マイページ情報取得

## 概要

認証済みユーザーのマイページ表示に必要な情報を取得する

## 認証

JWT 必須

## リクエスト

- Headers: Authorization: Bearer <JWT>

## ビジネスロジック

1. userId からユーザー情報を取得（存在しない場合は 404）
2. ショップの有無から hasShop を生成
3. 各種集計情報を取得

## 取得データ

### ユーザー情報

- user
- hasShop

### 集計情報

- itemCount（出品数）
- soldItemCount（売却数）
- unreadCount（未読通知数）
- referenceCount（参照コード適用数）

## レスポンス

```json
{
    "userData": {
        "user": {},
        "hasShop": true
    },
    "itemCount": 0,
    "soldItemCount": 0,
    "unreadCount": 0,
    "referenceCount": 0
}
```

## エラー

- 401 UNAUTHORIZED
- 404 USER_NOT_FOUND
- 500 INTERNAL_SERVER_ERROR

---

# GET /user/:id/profile — プロフィール情報取得

## 概要

ユーザーのプロフィール表示に必要な情報を取得する

## 認証

なし

## リクエスト

- params: userId
- query: page: 商品リストのページ
- query: limit: 商品リストの上限取得数
- Headers: Authorization: Bearer <JWT>

## ビジネスロジック

1. userId からユーザー情報を取得（存在しない場合は 404）
2. ショップの有無から hasShop を生成
3. ユーザーの商品リストを取得

## 取得データ

### ユーザー情報

- user
- hasShop

### 商品情報

- items（商品リスト）
- totalCount（ユーザー出品商品の総数）

## レスポンス

```json
{
    "user": {},
    "hasShop": true,
    "itemList": {
        "items": {},
        "hasItemCount": 0,
        "totalPages": 0
    }
}
```

## エラー

- 404 USER_NOT_FOUND
- 500 INTERNAL_SERVER_ERROR
