# 動画変換の全終了経路で一時ファイルを削除する

## 問題の概要

動画HLS変換がtimeout、ffmpegの非ゼロ終了、またはspawn errorで失敗した場合、ダウンロードした元動画と変換途中のディレクトリが削除されず、サーバー上に残る可能性がある。

## 原因

`convertVideoUseCase`の一時ファイル削除処理が、ffmpeg正常終了後に実行する変換・アップロード処理の`finally`内にだけ存在する。timeoutと非ゼロ終了はその`try/finally`へ入る前に失敗し、`error`イベントも外側Promiseをrejectするだけになっている。

## 修正方針

動画変換処理全体を、一時ファイル作成後は成功・失敗を問わずcleanupが実行される構造に変更する。存在しないファイルやディレクトリの削除でも元のエラーを隠さないよう、cleanup処理の責務とエラー処理を明確にする。

timeout、ffmpeg非ゼロ終了、spawn error、S3アップロード失敗、DB status更新失敗の各経路について、動画statusの扱いとcleanupの順序を定義する。

## 対象ファイル

- `/server/src/usecases/video/convert.ts`

## 参照すべきファイル

- `/server/src/utils/ffmpeg.ts`
- `/server/src/utils/s3/videoConvert.ts`
- `/server/src/services/video.ts`

## 実装内容

- 一時ファイルと変換ディレクトリのcleanupを全終了経路から到達する`finally`へ移動する。
- timeout、ffmpeg非ゼロ終了、spawn errorでもcleanupされることを確認する。
- cleanup失敗が本来の変換エラーを不必要に上書きしないようにする。
- 正常時のS3キー、動画status、HTTP受付レスポンスは変更しない。
- cleanup対象は、このUseCaseが生成した明示的なパスだけに限定する。
- 関連テストを追加し、成功と各失敗経路を確認する。
- `cd server && npm run lint && npm run typecheck`を実行する。

## 実装時の注意事項

- 新しいライブラリは追加しない。
- 永続ジョブキューの導入とは別タスクとして扱う。
- 広いディレクトリや未検証のパスを再帰削除しない。
