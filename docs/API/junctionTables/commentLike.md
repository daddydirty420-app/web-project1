# junctionTables/commentLike.md

## POST /comment-like/:id — コメントいいね作成

### リクエスト

- params:
    - commentId

### ビジネスロジック

- コメントいいねデータ取得
- コメントいいねデータ作成
- コメントsort_number追加（非同期）

---

## DELETE /comment-like/:id — コメントいいね削除

### リクエスト

- params:
    - commentId

### ビジネスロジック

- コメントいいねデータ取得
- コメントいいねデータ削除
- コメントsort_number減少（非同期）

---

## GET /comment-like/:id/user — コメントいいねしたユーザーリスト取得

### リクエスト

- params:
    - commentId
- query:
    - keyword

### ビジネスロジック

- いいねリスト取得
- フォロー状態の付与
- ユーザー情報マップ化

### レスポンス

- userList
