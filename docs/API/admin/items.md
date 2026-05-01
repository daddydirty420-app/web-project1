# admin/items.md

## DELETE /admin/items/:id — 商品強制削除

### リクエスト

- params:
    - itemId
- body:
    - deleteReason

### ビジネスロジック

- 2週間後金曜日算出
- 商品データ取得
- 取引中データ取得
- お知らせ作成
- 取引中データステータス更新
- 配送データステータス更新
- キャンセルデータ作成
- 購入者用お知らせ作成・口座情報取得
- 購入者宛て振込申請作成
- 取引中データ削除ログ作成
- s3データGlacier移動
- 商品削除ログ作成
- 商品完全削除
- メール送信

---

## GET /admin/items/:id/item-page — 管理者用商品ページ情報取得

### リクエスト

- params:
    - itemId

### ビジネスロジック

- 商品情報を取得
- いいね数カウント
- コメント数カウント
- 報告数カウント
- ユーザー情報（自分）を取得

### レスポンス

- items
- likeCount
- commentCount
- reportCount
- me
