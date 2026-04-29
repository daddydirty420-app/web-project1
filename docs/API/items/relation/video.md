# items/relation/video.md

## PATCH /video/:id/onplay — 動画再生ログ更新

### リクエスト

- params:
    - videoId

### ビジネスロジック

- 動画データ取得
- 再生回数 +1
- 商品データ取得
- sort_number追加（非同期）

---

## PATCH /video/:id/convert — 動画再生ログ更新

### リクエスト

- params:
    - videoId

### ビジネスロジック

- 動画データ取得
- 拡張子を抽出
- 一時保存先パス作成
- 変換ディレクトリ作成
- ffmpegでHLS変換
- setTimeout5分
- 再生時間取得
- HLSファイル生成
- HLSファイルS3アップロード
- 動画データ更新
- 後処理
