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

各処理がレスポンス前の完了保証を必要とするか、受付後に継続する処理かを既存API契約と呼び出し元から確認してください。受付後に継続する処理は、Controllerが裸のPromiseを管理しない共通task runner/helperまたは開始専用UseCaseへ移し、処理名と対象IDを含む一貫した失敗処理にしてください。対象UseCase内でServiceを意図なくfire-and-forgetしている箇所はawaitし、失敗を実行境界まで返してください。

動画変換に永続キューなどの新規基盤が必要な場合は、ライブラリを独断で追加せず、今回実装可能な範囲と別途必要な設計を報告してください。既存のHTTP status、レスポンス文言、処理結果を維持し、無関係なリファクタは行わないでください。

関連テストを追加または更新し、成功時の受付レスポンス、同期throw、非同期rejectが未処理Promiseにならず共通処理へ渡ることを確認してください。最後に `cd server && npm run lint && npm run typecheck` を実行して結果を報告してください。
```
