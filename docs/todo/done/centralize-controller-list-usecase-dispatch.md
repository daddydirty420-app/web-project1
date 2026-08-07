# 一覧取得のUseCaseディスパッチを業務UseCaseへ集約する

## 優先度

P2-refactor

## 原因

一覧APIが画面・一覧種別ごとの細分化されたUseCaseだけを持ち、どのUseCaseを選択してどの引数を渡すかという一覧取得フローをControllerが組み立てている。

## 現在の実装の問題点

- `getItemListController` が `view` と `type` の組み合わせから4種類のUseCaseを選択し、profile時の `pageUserId` 必須判定も行っている。
- `getRecommendItemsController` が `view` から3種類のUseCaseを選択し、itemPage時の `itemId` 必須判定も行っている。
- `usersMeItemsGetRootController` が検索語を正規化し、`type` から7種類のUseCaseを選択し、uploadedだけ異なる引数を構築している。
- 各マップの戻り値が `Promise<any>` になり、選択先UseCaseの戻り値契約がControllerから見えない。
- zodのenumで検証済みの値に対してController内でも存在チェックを行っており、入力検証、業務上の組み合わせ検証、処理選択の責務が分散している。
- 一覧種別を追加する際、Validator、Controllerのimport・マップ・引数構築、個別UseCaseを同時に変更する必要がある。

`ordersGetRootController` にも購入・販売の選択があるが、現状は単純な二択で責務混在が小さいため、このTodoの対象には含めない。

## 修正方針

API単位の上位UseCaseを追加し、Controllerはvalidated queryとuserIdを渡して統一された結果を受け取るだけにする。上位UseCaseが種別ごとのUseCaseを選択し、組み合わせ依存の必須値確認と引数構築を担当する。

各上位UseCaseに具体的な入力・戻り値型を定義し、`Promise<any>` を使用しない。下位UseCaseとServiceの処理、ページング方式、レスポンス形式は維持する。Strategyや共通基底クラスを導入する必要はなく、判別可能なunionまたは型安全なswitch/mapのうち最も単純な方法を選ぶ。

## 共通化・移動先の候補

- `/server/src/usecases/items/itemList`: `view`・`type` を受ける商品一覧の上位UseCase
- `/server/src/usecases/items/itemList/recommend`: `view` を受けるレコメンド一覧の上位UseCase
- `/server/src/usecases/items/itemList/userItems`: `type` を受けるユーザー関連商品一覧の上位UseCase
- keywordの正規化はユーザー関連商品一覧の上位UseCase、または入力正規化の責務を統一できる既存層

## 対象ファイル・関数

- `/server/src/controllers/items.ts`
    - `getItemListController`
    - `getRecommendItemsController`
- `/server/src/controllers/users/me/items.ts`
    - `usersMeItemsGetRootController`
- `/server/src/usecases/items/itemList/**`
- `/server/src/validators/query/items.ts`
- `/server/src/validators/query/userItems.ts`

## 影響範囲

- LP・プロフィールの商品／動画一覧
- トップ・カート・商品ページのレコメンド一覧
- カート、削除済み、下書き、いいね、在庫、出品、閲覧履歴の商品一覧
- 一覧系UseCaseの入力・戻り値型

HTTP status、レスポンスキー、既定のpage・limit、検索語の現在の正規化結果は変更しない。

## Codexへそのまま渡せる実装プロンプト

```text
`/server`、Controller、UseCase、Validatorの各AGENTS.mdとコーディング規約を確認してください。

`getItemListController`、`getRecommendItemsController`、`usersMeItemsGetRootController` にある一覧種別ごとのUseCase選択、組み合わせ依存の引数確認、引数構築を、API単位の上位UseCaseへ移動してください。

Controllerは認証ユーザーとvalidated queryから必要値を取得し、上位UseCaseを1回呼び、既存レスポンスを返すだけにしてください。上位UseCaseは既存の個別UseCaseを再利用し、view/typeごとの処理選択と、profileのpageUserId・itemPageのitemIdなど組み合わせ依存の確認を担当してください。

入力と戻り値には具体的な型または判別可能なunionを定義し、`Promise<any>`、新しい `any`、不要な型アサーションを使用しないでください。過度なStrategyクラスや新しいライブラリは導入せず、既存の検索結果、ページング、エラー、HTTP status、レスポンス形式を維持してください。`ordersGetRootController` は今回変更しないでください。

関連テストを追加または更新し、全view/typeと必須パラメータ不足を確認してください。最後に `cd server && npm run lint && npm run typecheck` を実行して結果を報告してください。
```

---

追記

## 作成するファイル

### getItemListController

/server/src/usecases/items/itemList/itemList.ts

### getRecommendItemsController

/server/src/usecases/items/itemList/recommendItems.ts

### usersMeItemsGetRootController

/server/src/usecases/items/itemList/userItems.ts

---

## 作業上の諸注意

- 必ず進捗を報告しながら作業すること
- 今回のタスクと関係のないエラーや問題を発見したら、修正せず、/docs/todo配下の適切なフォルダにmarkdown形式でまとめること

---

## 報告

実装完了しました。3つの上位UseCaseへディスパッチ処理を移動しています。

作成ファイル:

- server/src/usecases/items/itemList/itemList.ts
- server/src/usecases/items/itemList/recommendItems.ts
- server/src/usecases/items/itemList/userItems.ts

変更内容:

- server/src/controllers/items.ts
    - 商品一覧・レコメンド一覧を上位UseCaseの1回呼び出しへ変更
    - Promise<any>、UseCase map、組み合わせ判定を削除

- server/src/controllers/users/me/items.ts
    - 7種類の一覧選択とkeyword正規化を上位UseCaseへ移動

- PAGE_USER_NOT_FOUND、INVALID_QUERYなどの既存エラーを維持
- 戻り値をAwaited<ReturnType<...>>のunionで具体的に型定義
- HTTP status、レスポンスキー、page・limit、正規化処理は変更なし
- Validatorは既存の推論型で要件を満たすため変更なし
- ordersGetRootControllerは変更なし

確認結果:

- npm run lint: 成功
- npm run typecheck: 成功
- 空白・差分チェック: 問題なし
- 関連テスト基盤・テストスクリプトがないため、テスト追加は行っていません

既存のTodoファイルにあったユーザー側の変更はそのまま維持しています。
