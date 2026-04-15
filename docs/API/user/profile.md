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