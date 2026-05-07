# items/relation/comment.md

## POST /comment/:id?sellerMe(&parentId) — コメント作成

### リクエスト

- params:
    - itemId
- query:
    - sellerMe
    - parentId
- body:
    - inputComment

### ビジネスロジック

- 親コメントsort_number更新（非同期）
- 商品データ取得
- コメントデータ作成
- 商品sort_number更新（非同期）

### レスポンス

- comment

---

## DELETE /comment/:id?page — コメント削除

### リクエスト

- params:
    - commentId
- query:
    - page

### ビジネスロジック

- コメントデータ取得
- 商品データ取得
- コメントデータ削除
- お知らせ作成（非同期）
