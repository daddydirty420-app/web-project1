# ショップの動的更新APIで更新可能カラムを制限する

## 優先度

P1-bug

## 原因

ショップ登録確認画面の部分更新APIが、更新対象のフィールドを限定するschemaを持っていない。Controllerは未検証の `req.body` を `updateData` としてUseCaseへ渡し、UseCaseとServiceも `any` のままSequelizeの `update()` へ渡している。

## 現在の実装の問題点

- `shopInfoPatchByIdSignupEditController` と `shopInfoEditPatchByIdController` が `req.validatedBody` ではなく `req.body` を直接参照している。
- 対応するRouteに `validateBody(...)` が設定されていない。
- UseCaseの `updateData` とServiceの `data` が `any` であり、許可するフィールドが型でも実行時検証でも限定されていない。
- 所有権確認は行われているが、リクエストに含めたモデル属性がそのまま更新候補になるため、`user_id`、審査状態、関連IDなど、本来クライアントから変更させない属性を更新できる可能性がある。
- フロントエンドの `fetchUpdateField` も `field: string` を受け取るため、APIとクライアントの双方で許可フィールドが型として表現されていない。

## 修正方針

各APIで編集を許可するフィールドと値の型を仕様・画面実装から確定し、zod schemaでホワイトリスト化する。Routeで `validateBody(...)` を実行し、Controllerは `req.validatedBody` だけをUseCaseへ渡す。

UseCaseとServiceでは `any` を廃止し、schemaから推論した型、または許可された更新DTOを使用する。Serviceへ渡す前にAPIのフィールド名からDBカラム名へ明示的にマッピングし、識別子、所有者、審査状態、作成日時などの保護対象属性が更新データへ混入しない構造にする。

既存クライアントが送信しているフィールド名と値の形式を確認し、許可された更新の挙動とレスポンス形式は維持する。

## 共通化・移動先の候補

- `/server/src/validators/body/shopInfo.ts`: ショップ登録確認画面用の部分更新schemaと型
- `/server/src/validators/body/shopInfoEdit.ts`: 事業形態変更確認画面用の部分更新schemaと型
- `/server/src/usecases/shopInfo/edit/signupEdit.ts`: 許可済みDTOからDB更新データへの変換
- `/server/src/usecases/shopInfoEdit/update/updateAny.ts`: 許可済みDTOからDB更新データへの変換
- `/server/src/types/serviceType/shopInfo.ts`、`shopInfoEdit.ts`: Service引数の具体的な型

## 対象ファイル・関数

- `/server/src/controllers/shop_info.ts`
  - `shopInfoPatchByIdSignupEditController`
- `/server/src/controllers/shop_info_edit.ts`
  - `shopInfoEditPatchByIdController`
- `/server/src/routes/shop_info.ts`
- `/server/src/routes/shop_info_edit.ts`
- `/server/src/validators/body/shopInfo.ts`
- `/server/src/validators/body/shopInfoEdit.ts`
- `/server/src/usecases/shopInfo/edit/signupEdit.ts`
  - `updateShopSignupEditUseCase`
- `/server/src/usecases/shopInfoEdit/update/updateAny.ts`
  - `updateShopEditAnyUseCase`
- `/server/src/services/shopInfo/command.ts`
  - `updateShopAny`
- `/server/src/services/shopInfoEdit/command.ts`
  - `updateShopEditAny`
- `/server/src/types/serviceType/shopInfo.ts`
- `/server/src/types/serviceType/shopInfoEdit.ts`
- `/client/src/app/shop-signup/api/step5.ts`
- `/client/src/app/edit/api/shop/shopEdit/client.ts`

## 影響範囲

- ショップ登録確認画面のフィールド単位更新
- 事業形態変更確認画面のフィールド単位更新
- 対象APIの入力エラー形式
- ShopInfo、ShopInfoEditの更新可能属性

## Codexへそのまま渡せる実装プロンプト

```text
`/server`、Controller、Route、Validator、UseCase、Serviceの各AGENTS.mdとコーディング規約を確認してください。

`PATCH /shop-info/:id/signup/edit` と `PATCH /shop-info-edit/:id` が未検証の `req.body` をSequelizeの更新へ渡している問題を修正してください。

フロントエンドの呼び出し元と既存モデルを確認して、各APIで更新を許可するフィールドと値型を明示したzod schemaを作成し、Routeへ `validateBody(...)` を追加してください。Controllerは `req.validatedBody` のみを取得してUseCaseへ渡してください。UseCaseでは許可済みDTOをDBカラムへ明示的にマッピングし、Serviceの `data: any` も具体的な更新型へ置き換えてください。

`user_id`、各種ID、審査・公開状態、作成日時など、画面からの更新を許可していないモデル属性はリクエストから更新できないようにしてください。新しいライブラリは追加せず、許可済みフィールドの既存挙動とレスポンス形式は維持してください。

必要なテストを追加または更新し、許可フィールドは更新できること、未知のフィールドと保護対象フィールドは拒否されることを確認してください。最後に `cd server && npm run lint && npm run typecheck` を実行して結果を報告してください。
```
