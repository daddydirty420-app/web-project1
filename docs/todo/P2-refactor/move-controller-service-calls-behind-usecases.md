# ControllerからのService直接呼び出しをUseCase経由へ統一する

## 優先度

P2-refactor

## 原因

RouteからControllerを分離した際、一部の読み取り処理だけが既存Serviceを直接呼ぶ形で残り、ControllerとUseCaseの責務境界が機能ごとに揃っていない。

## 現在の実装の問題点

ControllerはUseCaseを呼ぶという規約に対し、次の6関数がServiceを直接importして実行している。

- `commentLikeGetByIdCountController`: `countCommentLike`
- `commentReportGetAllOptionsController`: `getAllCommentReportOptions`
- `itemReportGetAllOptionsController`: `getAllItemReportOptions`
- `notificationGetUnreadCountController`: `countUnread`
- `usersGetByIdStarController`: `getStar`
- `usersGetByIdProfileMetadataController`: `getProfileMetadata`

同種の処理でも、例えば商品いいね数は `itemLikeCountUseCase` を経由する一方、コメントいいね数はServiceを直接呼ぶ。機能追加時に業務条件、エラー変換、戻り値整形を置く場所が一定せず、Controllerの単体テストもDBアクセス層へ直接依存する。

## 修正方針

各読み取り処理に責務の明確なUseCaseを用意し、ControllerはRequest値の取得、UseCase呼び出し、Response返却だけを行う形へ統一する。

単に抽象化を増やすだけにならないよう、既存の機能別UseCaseディレクトリへ配置し、入力型と戻り値の契約を明示する。現時点で追加の業務判断が不要な処理はServiceの薄い委譲でよいが、HTTPやExpressの型をUseCaseへ持ち込まない。

## 共通化・移動先の候補

- `/server/src/usecases/commentLike/count.ts`: 商品いいねの実装に揃えたコメントいいね数UseCase
- `/server/src/usecases/commentReport`: 報告選択肢取得UseCase
- `/server/src/usecases/itemReport`: 報告選択肢取得UseCase
- `/server/src/usecases/notification`: 未読数取得UseCase
- `/server/src/usecases/users/get`: スター数・プロフィールmetadata取得UseCase

## 対象ファイル・関数

- `/server/src/controllers/comment-like.ts`
  - `commentLikeGetByIdCountController`
- `/server/src/controllers/comment_report.ts`
  - `commentReportGetAllOptionsController`
- `/server/src/controllers/item_report.ts`
  - `itemReportGetAllOptionsController`
- `/server/src/controllers/notification.ts`
  - `notificationGetUnreadCountController`
- `/server/src/controllers/users.ts`
  - `usersGetByIdStarController`
  - `usersGetByIdProfileMetadataController`
- 上記処理に対応する `/server/src/usecases` と `/server/src/services`

## 影響範囲

- コメントいいね数取得API
- コメント・商品報告の選択肢取得API
- 未読通知数取得API
- ユーザーのスター数・プロフィールmetadata取得API

レスポンス形式、HTTP status、Serviceの検索条件は変更しない。

## Codexへそのまま渡せる実装プロンプト

```text
`/server`、`/server/src/controllers`、`/server/src/usecases`、`/server/src/services` 配下で適用されるAGENTS.mdとコーディング規約を確認してください。

ControllerからServiceを直接呼んでいる次の処理を、機能別のUseCase経由へ変更してください。

- commentLikeGetByIdCountController / countCommentLike
- commentReportGetAllOptionsController / getAllCommentReportOptions
- itemReportGetAllOptionsController / getAllItemReportOptions
- notificationGetUnreadCountController / countUnread
- usersGetByIdStarController / getStar
- usersGetByIdProfileMetadataController / getProfileMetadata

既存のUseCaseディレクトリ構成と命名に合わせ、具体的な引数型と戻り値を持つUseCaseを追加してください。ControllerはRequest値の取得、UseCase呼び出し、既存Response返却だけにしてください。Serviceの検索条件、HTTP status、レスポンスキー、エラー挙動は変更しないでください。新しいライブラリや無関係なリファクタは追加しないでください。

変更後は関連テストを実行し、`cd server && npm run lint && npm run typecheck` の結果を報告してください。
```
