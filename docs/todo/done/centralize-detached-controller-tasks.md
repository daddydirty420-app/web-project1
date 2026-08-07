# Controllerのfire-and-forget実行と失敗処理を共通化する

## 優先度

P2-refactor

## 原因

アクセス・再生ログ、ランキング値更新、動画変換をHTTPレスポンスより後まで実行するため、各ControllerがUseCaseをawaitせず、個別に `.catch(console.error)` を付けている。非同期受付処理の実行責務と失敗時の扱いが共通化されていない。

## 現在の実装の問題点

- 7つのControllerで同じfire-and-forgetパターンが重複している。
- 失敗は `console.error(err)` だけで処理名や対象IDなどの文脈が揃っておらず、呼び出し元へもエラー処理基盤へも伝わらない。
- `videoPatchByIdOnplayController` は非同期完了を待たない点が他と同じなのに `200`、それ以外の多くは `202` で、受付完了の意味が処理ごとに明示されていない。
- Controllerだけでなく対象UseCase内でもServiceをawaitせず `.catch(console.error)` している箇所があり、どの層が処理完了と失敗に責任を持つか曖昧になっている。
- 長時間実行される動画変換もHTTPプロセス内で切り離されるため、プロセス終了時の扱いや二重実行防止をControllerから保証できない。

## 修正方針

まず各処理について、「レスポンス前に完了を保証する処理」と「受付後に継続する処理」を明示する。受付後に継続する処理は、Controllerが裸のPromiseを直接管理しない共通の実行境界へ移す。

既存インフラの範囲で、処理名・対象IDを含めた一貫した失敗処理を行うtask runner/helper、または処理開始専用UseCaseを設ける。内部のDB更新も、意図して切り離す箇所以外はawaitして失敗を上位へ返す。動画変換について永続キュー等が必要と判断した場合は、新規ライブラリを独断で追加せず、別途設計判断として切り出す。

HTTP statusやレスポンス文言の変更はAPI契約への影響を確認してから行い、リファクタだけで変更しない。

## 共通化・移動先の候補

- `/server/src/utils`: fire-and-forget実行時の共通task runner/helper
- `/server/src/usecases/items`: sort number・アクセスログの実行責務
- `/server/src/usecases/comment`: sort numberの実行責務
- `/server/src/usecases/video`: 再生ログ・変換開始の実行責務
- 既存の共通エラー記録基盤が追加されている場合は、その基盤へ統合する

## 対象ファイル・関数

- `/server/src/controllers/items.ts`
    - `addItemSortNumberController`
    - `decreaseItemSortNumberController`
    - `patchItemAccessLogsController`
- `/server/src/controllers/comment.ts`
    - `commentPatchByIdSortNumberAddController`
    - `commentPatchByIdSortNumberDecreaseController`
- `/server/src/controllers/video.ts`
    - `videoPatchByIdOnplayController`
    - `videoPatchByIdConvertController`
- `/server/src/usecases/items/sortNumber/sortNumber.ts`
- `/server/src/usecases/items/log/accessLogs.ts`
- `/server/src/usecases/comment/patchSortNumber.ts`
- `/server/src/usecases/video/onPlay.ts`
- `/server/src/usecases/video/convert.ts`

## 影響範囲

- 商品・コメントのsort number更新
- 商品アクセスログと閲覧履歴
- 動画再生回数
- 動画HLS変換
- 非同期処理のログ、エラー監視、HTTP受付レスポンス

## Codexへそのまま渡せる実装プロンプト

```text
`/server`、Controller、UseCase、Service、Utilsで適用されるAGENTS.mdとコーディング規約を確認してください。

items.ts、comment.ts、video.tsのControllerに重複している、UseCaseをawaitせず `.catch(console.error)` してレスポンスを返す処理を整理してください。

対象のファイル、関数は以下の通りです。

- `/server/src/controllers/items.ts`
  - `addItemSortNumberController`
  - `decreaseItemSortNumberController`
  - `patchItemAccessLogsController`
- `/server/src/controllers/comment.ts`
  - `commentPatchByIdSortNumberAddController`
  - `commentPatchByIdSortNumberDecreaseController`
- `/server/src/controllers/video.ts`
  - `videoPatchByIdOnplayController`
  - `videoPatchByIdConvertController`
- `/server/src/usecases/items/sortNumber/sortNumber.ts`
- `/server/src/usecases/items/log/accessLogs.ts`
- `/server/src/usecases/comment/patchSortNumber.ts`
- `/server/src/usecases/video/onPlay.ts`
- `/server/src/usecases/video/convert.ts`

影響範囲は以下の通りです。

- 商品・コメントのsort number更新
- 商品アクセスログと閲覧履歴
- 動画再生回数
- 動画HLS変換
- 非同期処理のログ、エラー監視、HTTP受付レスポンス

各処理がレスポンス前の完了保証を必要とするか、受付後に継続する処理かを既存API契約と呼び出し元から確認してください。受付後に継続する処理は、Controllerが裸のPromiseを管理しない共通task runner/helperまたは開始専用UseCaseへ移し、処理名と対象IDを含む一貫した失敗処理にしてください。HTTPレスポンスから切り離す境界はController側の共通実行境界に限定し、その境界より内側のUseCase・Service間では、さらに切り離す明確な理由がない限りawaitして失敗を実行境界まで伝播させてください。

動画変換に永続キューなどの新規基盤が必要な場合は、ライブラリを独断で追加せず、今回実装可能な範囲と別途必要な設計を報告してください。既存のHTTP status、レスポンス文言、処理結果を維持し、無関係なリファクタは行わないでください。

関連テストを追加または更新し、成功時の受付レスポンス、同期throw、非同期rejectが未処理Promiseにならず共通処理へ渡ることを確認してください。最後に `cd server && npm run lint && npm run typecheck` を実行して結果を報告してください。
```

---

## 報告

非同期処理の実行境界を整理しました。HTTP status・レスポンス文言は維持しています。

主な変更:

- 共通の server/src/utils/runDetachedTask.ts を追加
    - 同期throwと非同期rejectを捕捉
    - task名と対象IDを含めて一貫して記録

- 7つのControllerを共通実行境界へ移行
- UseCase内の対象Service呼び出しをawait化
- 動画変換のEventEmitter内エラーを外側Promiseへ伝播
- 動画再生APIの200、その他の202と既存文言を維持

変更したController:

- server/src/controllers/items.ts
- server/src/controllers/comment.ts
- server/src/controllers/video.ts

変更したUseCase:

- server/src/usecases/items/sortNumber/sortNumber.ts
- server/src/usecases/items/log/accessLogs.ts
- server/src/usecases/comment/patchSortNumber.ts
- server/src/usecases/video/onPlay.ts
- server/src/usecases/video/convert.ts

確認結果:

- runDetachedTask成功時: エラー記録なし
- 同期throw: 共通処理で捕捉
- 非同期reject: 共通処理で捕捉
- npm run lint: 成功
- npm run typecheck: 成功
- git diff --check: 問題なし

既存のテスト基盤・testスクリプトがないため、永続テストファイルは追加せず、helperを直接実行して3経路を検証しました。

動画変換は引き続きプロセス内実行です。EC2プロセスの停止・再起動をまたいだ実行保証には永続キュー等の別設計が必要ですが、今回は新規基盤を追加していません。

また、変換失敗時に一時ファイルが残る既存問題を別Todoへ記録しました。

- docs/todo/P1-bug/cleanup-video-conversion-temp-files-on-all-exits.md
