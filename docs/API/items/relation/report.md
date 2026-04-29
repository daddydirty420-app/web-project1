# items/relation/report.md

## POST /item-report/:id — 商品報告作成

### リクエスト

- params:
    - itemId
- body:
    - selected

### ビジネスロジック

- idバリデーションチェック
- optionデータ取得
- 商品データ取得
- ユーザーデータ更新
- 報告データ更新
- report_score更新（非同期）

---

## POST /comment-report/:id — コメント報告作成

### リクエスト

- params:
    - commentId
- body:
    - selected

### ビジネスロジック

- idバリデーションチェック
- optionデータ取得
- コメントデータ取得
- ユーザーデータ更新
- 報告データ更新
- report_score更新（非同期）
