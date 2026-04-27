# item/createItem.md

## POST /items — 商品データ作成

### ビジネスロジック

- 商品テーブル作成
- 商品テーブルに紐づくテーブル（動画、割引、配送情報）作成

### レスポンス

- itemId

---

## POST /items/:id/copy-upload — 商品データコピー作成

### リクエスト

- params:
    - itemId

### ビジネスロジック

- コピー元商品情報取得
- コピー元s3Urlバリデーションチェック
- コピー元s3ファイル名取得
- s3にコピーしたファイルのurl取得
- 商品テーブル作成
- 商品テーブルに紐づくテーブル（動画、割引、配送情報）作成

### レスポンス

- itemId

---

## PUT /items/:id (main) — 商品アップロード

### リクエスト

- params:
    - itemId
- query
    - mode=main
- body

### ビジネスロジック

- 商品情報取得
- s3署名付きurl生成
- id、マスターテーブル　バリデーションチェック
- ブランド照合・登録
- 商品テーブル更新
- 商品テーブルに紐づくテーブル（動画、割引、配送情報）更新
- お知らせ作成（非同期）

### レスポンス

- s3署名付きURL
    - videoSignedUrl
    - thumbnailSignedUrl
    - itemImageSignedUrls
    - attributesImageSignedUrls

---

## PUT /items/:id (draft) — 下書き商品アップロード

### リクエスト

- params:
    - itemId
- query
    - mode=draft
- body

### ビジネスロジック

- 商品情報取得
- s3署名付きurl生成
- id、マスターテーブル　バリデーションチェック
- ブランド照合・登録
- 商品テーブル更新
- 商品テーブルに紐づくテーブル（動画、割引、配送情報）更新
- お知らせ作成（非同期）

### レスポンス

- s3署名付きURL
    - videoSignedUrl
    - thumbnailSignedUrl
    - itemImageSignedUrls
    - attributesImageSignedUrls

---

## PATCH /items/:id/publish — 商品公開

### リクエスト

- params:
    - itemId

### ビジネスロジック

- 商品情報取得
- sort_number設定
- search_text設定
- 商品テーブル更新
- お知らせ作成（非同期）
