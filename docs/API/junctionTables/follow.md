# junctionTables/follow.md

## POST /follow/:id — フォロー作成

### リクエスト

- params
    - targetUserId

### ビジネスロジック

- targetUserIdバリデーションチェック
- フォローデータ取得
- フォローデータ作成

---

## DELETE /follow/:id — フォロー削除

### リクエスト

- params
    - targetUserId

### ビジネスロジック

- targetUserIdバリデーションチェック
- フォローデータ取得
- フォローデータ削除

---

## GET /follow/:id — フォロー・フォロワーリスト取得

### リクエスト

- params
    - pageUserId
- query
    - type
    - keyword

### ビジネスロジック

- フォロー・フォロワーリスト取得
- 自分がフォローしているかどうか（is_following）を追加

### レスポンス

- userList
