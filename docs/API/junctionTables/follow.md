# junctionTables/follow.md

## POST /follow/:id — フォロー作成

### リクエスト

- params:
    - targetUserId

### ビジネスロジック

- targetUserIdバリデーションチェック
- フォローデータ取得
- フォローデータ作成

---

## DELETE /follow/:id — フォロー削除

### リクエスト

- params:
    - targetUserId

### ビジネスロジック

- targetUserIdバリデーションチェック
- フォローデータ取得
- フォローデータ削除

---

## GET /follow/:id/user — フォロー・フォロワーリスト取得

### リクエスト

- params:
    - pageUserId
- query:
    - type
    - keyword

### ビジネスロジック

- フォロー・フォロワーリスト取得
- フォロー状態の付与
- ユーザー情報マップ化

### レスポンス

- userList
