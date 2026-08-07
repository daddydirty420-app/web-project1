# ffmpegのイベントリスナーをspawn直後に登録する

## 問題の概要

PR #87の`convertVideoUseCase`では、`ffmpeg`プロセスを起動してから`close`と`error`のイベントリスナーを登録するまでの間に非同期処理がある。

この間に`ffmpeg`の起動失敗や早期終了が発生すると、次の重大な問題が起こり得る。

- `error`イベントが未処理となり、Node.jsプロセスが異常終了する
- `close`イベントを取りこぼし、変換完了を待つPromiseが永久にsettleしない
- 動画statusが`processing`のまま残り、一時ファイルのcleanupにも到達しない

HTTPレスポンスから切り離された動画変換タスクで発生するため、リクエスト単位の失敗に留まらず、バックエンド全体の停止や処理滞留につながる。

## 原因

`convertVideoUseCase`は`spawn`で子プロセスを生成した後、動画時間を取得する`getDuration`を`await`している。その後で初めて、変換完了を待つPromiseを作成し、子プロセスの`close`と`error`へリスナーを登録している。

Node.jsのEventEmitterは、リスナー登録前に発火したイベントを後から再配信しない。また、ChildProcessの`error`イベントにリスナーがない場合はuncaught errorとして扱われる。外側の`try/catch/finally`では、この未処理イベントを捕捉できない。

## 修正方針

子プロセスを生成した直後、最初の`await`やイベントループへの制御移譲より前に、`error`と`close`のリスナーを同期的に登録する。

変換結果を表すPromiseをspawn直後に構築・保持し、動画時間取得や進捗処理との実行順序を整理する。`error`と`close`が続けて発火する可能性も考慮し、変換処理の完了、timeout解除、status更新、rejectが一度だけ行われるようにする。

すべての失敗を既存の実行境界まで伝播させ、外側の`finally`による一時ファイルcleanupへ必ず到達させる。

## 対象ファイル

- `/server/src/usecases/video/convert.ts`
    - `convertVideoUseCase`

## 参照すべきファイル

- `/server/src/controllers/video.ts`
- `/server/src/utils/ffmpeg.ts`
- `/server/src/utils/runDetachedTask.ts`
- `/server/src/utils/videoConversionCleanup.ts`
- 動画変換UseCaseの既存テスト

## 実装内容

- `spawn`直後かつ最初の`await`より前に、子プロセスの`error`と`close`を監視する。
- 起動失敗、即時の非ゼロ終了、正常終了の各経路で、変換結果Promiseが必ずsettleするようにする。
- 複数イベントによる二重status更新、二重reject、timeoutの残存を防ぐ。
- 起動失敗と早期終了でも、動画statusが既存仕様どおり失敗状態へ更新されることを確認する。
- 起動失敗と早期終了でも、元動画と変換ディレクトリのcleanupへ到達することを確認する。
- `getDuration`が完了する前に`error`または`close`が発生するケースのテストを追加する。
- 未処理のChildProcess `error`および未処理Promise rejectionが発生しないことをテストする。
- 正常時のS3キー、動画status、HTTP受付レスポンス、進捗更新の挙動を維持する。
- `cd server && npm run lint && npm run typecheck`を実行する。

## 実装時の注意事項

- ChildProcessのイベントリスナー登録前に`await`を置かない。
- `error`後に`close`も発火し得るため、両イベントを独立した完了処理として扱わない。
- cleanup失敗で元の変換エラーを上書きしない。
- このUseCaseが生成した明示的な一時パス以外を削除しない。
- 新しいライブラリや永続ジョブキューは追加しない。
- 動画変換以外の無関係な処理は変更しない。
