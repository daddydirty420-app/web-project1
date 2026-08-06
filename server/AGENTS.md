# Server Agent Instructions

## 対象

このファイルは `/server` 配下の作業に適用する。

ルートディレクトリの `AGENTS.md` のルールを前提とし、
このファイルではバックエンド固有の追加ルールを定義する。

ルートのルールとこのファイルが矛盾する場合は、
より作業対象に近いこのファイルのルールを優先する。

## 技術構成

-   Node.js
-   Express
-   TypeScript
-   ESM
-   Sequelize 6
-   PostgreSQL
-   zod

CommonJS 形式は使用せず、既存コードに合わせて ESM 形式で実装する。

## ディレクトリと責務

### `/server/src/routes`

-   URL と HTTP メソッドを定義する
-   middleware と controller を接続する
-   業務ロジックや DB アクセスを書かない
-   バリデーションは既存の middleware を利用する

### `/server/src/controllers`

-   Request から必要な値を取得する
-   usecase を呼び出す
-   Response を返す
-   業務ロジックや DB アクセスを書かない
-   複雑な条件分岐やデータ加工は usecase へ移す

### `/server/src/middleware`

-   認証
-   認可
-   レート制限
-   バリデーション
-   エラーハンドリング

middleware 内に個別機能の業務ロジックを書かない。

### `/server/src/validators`

-   zod による入力値の検証を行う
-   query、params、body を必要に応じて分ける
-   controller 内で同じ検証を重複させない
-   型変換や default 値は既存パターンに合わせる

### `/server/src/usecase`

-   業務ロジックを扱う
-   複数の service 呼び出しを組み合わせる
-   所有権、状態、権限などの業務上の条件を確認する
-   Express の Request、Response を受け取らない
-   Sequelize Model を直接操作せず、原則として service を経由する

### `/server/src/service`

-   DB アクセスを扱う
-   Sequelize の検索、作成、更新、削除処理を行う
-   外部サービスとの通信を扱う
-   業務上の判断や HTTP レスポンス処理を書かない
-   Express の Request、Response を受け取らない

### `/server/src/models`

-   Sequelize モデルを定義する
-   モデル固有の規約は `/server/src/models/AGENTS.md` に従う
-   モデルを変更した場合は、必要なマイグレーションの有無を確認する

### `/server/migrations`

-   DB スキーマ変更を定義する
-   migration 固有の規約がある場合は、対象ディレクトリの `AGENTS.md` に従う

## Controller

controller では以下のみを行う。

1. 認証済みユーザー情報を取得する
2. バリデーション済みの params、query、body を取得する
3. usecase へ渡す引数を構築する
4. usecase を呼び出す
5. HTTP レスポンスを返す

controller で以下を行わない。

-   Sequelize Model の直接操作
-   複雑な業務条件の判定
-   所有権チェック
-   transaction の開始
-   外部サービスへの直接アクセス
-   再利用可能なデータ加工処理

## Usecase

usecase では以下を確認する。

-   対象データが存在するか
-   操作ユーザーが対象データを所有しているか
-   操作可能な status か
-   他データとの整合性が保たれているか
-   必要な関連データが存在するか

所有権チェックでは、URL パラメータの ID だけを信用しない。

可能な場合は service の検索条件へ `user_id` などを含め、
取得と所有権確認を同時に行う。

例:

```ts
const item = await getMyItemService({
    itemId,
    userId,
});
```

取得後に別処理で `item.user_id === userId` を確認する方法より、
検索条件に所有者 ID を含める方法を優先する。

## Service

service 関数は、処理内容が分かる具体的な名前にする。

例:

```ts
getItemService;
getMyItemService;
createItemService;
updateItemService;
deleteItemService;
```

所有者を条件に含む取得処理は、通常取得と区別する。

service では必要な `attributes`、`include`、`where` を明示し、
不要なカラムや関連を取得しない。

`findByPk` を使用して取得後に所有権を判定するより、
所有権条件が必要な場合は `findOne` の `where` に含めることを優先する。

## Transaction

複数の DB 更新をまとめて成功または失敗させる必要がある場合は、
transaction を使用する。

transaction の開始と commit、rollback は、
原則として usecase で管理する。

service は必要に応じて transaction を引数で受け取る。

例:

```ts
type CreateItemParams = {
    data: CreateItemData;
    transaction?: Transaction;
};
```

transaction を受け取った service では、
対象の Sequelize 処理へ必ず transaction を渡す。

## Sequelize

-   Model の制約を独断で変更しない
-   `allowNull`
-   `defaultValue`
-   `unique`
-   `references`
-   `onUpdate`
-   `onDelete`

これらは既存 Model、既存 migration、現在の依頼内容を確認して決定する。

DB へすでに反映された仕様へ Model を合わせる作業では、
現在の DB 仕様またはそれを示す資料を正とする。

DB の状態を直接確認できない場合は推測で制約を変更せず、
依頼内容、既存 migration、既存 Model から確認できる範囲に留める。

`sequelize.sync()` を本番運用やスキーマ更新目的で使用しない。

## Model と Migration

Model を変更した場合は、以下を確認する。

-   カラム追加または削除
-   型変更
-   nullable 変更
-   defaultValue 変更
-   unique 制約変更
-   外部キー変更
-   onUpdate、onDelete 変更
-   index 変更
-   テーブル名変更

DB 変更が必要な場合は migration を作成する。

ただし、明示的な依頼がない場合は migration を実行しない。

既存 migration は原則として変更せず、
新しい migration を追加する。

## エラー処理

-   既存の `AppError` を使用する
-   controller や usecase で独自形式の Error を乱立させない
-   エラーレスポンスはグローバルエラーハンドラーへ委ねる
-   catch して同じエラーをそのまま投げ直すだけの処理は追加しない
-   内部エラーの詳細をレスポンスへ直接含めない

例:

```ts
throw new AppError("ITEM_NOT_FOUND", 404);
```

## 型

-   `any` は原則として使用しない
-   Request の body、params、query を未検証のまま型アサーションしない
-   validator で検証済みの値は、既存の型付け方法に合わせて取得する
-   service と usecase の引数はオブジェクト形式を優先する
-   複数箇所で使用する型は適切な type ファイルへ分離する
-   1 ファイル内だけで使用する型は、必要に応じてそのファイル内に定義する

## import

-   ESM 形式を使用する
-   相対 import の拡張子は既存コードに合わせて `.js` を使用する
-   import 順は既存ファイルの規則を維持する
-   循環参照を発生させない

例:

```ts
import type { NextFunction, Request, Response } from "express";
import { Transaction } from "sequelize";

import { AppError } from "../errors/AppError.js";
```

## セキュリティ

-   認証が必要な route では認証 middleware を省略しない
-   認可や所有権確認を controller だけに依存しない
-   管理者機能では管理者権限を確認する
-   raw query を追加する場合はバインドパラメータを使用する
-   パスワード、トークン、Cookie、個人情報をログへ出力しない
-   ユーザー入力をそのまま SQL やファイルパスへ使用しない
-   クライアントから渡された金額、割引額、所有者 ID を信用しない

## status 管理

status によって公開範囲や操作可否が変わるデータでは、
取得、更新、削除の条件に必要な status を含める。

特に以下を確認する。

-   非公開データが一覧や詳細 API に含まれないか
-   削除済みデータを取得していないか
-   下書きデータを他ユーザーが操作できないか
-   管理画面と一般ユーザー向け API で条件が混在していないか

status 条件を追加または変更する場合は、
関連する取得処理への影響も確認する。

## スコープ管理

現在依頼されている範囲以外は変更しない。

作業中に無関係なバグ、改善点、リファクタ候補を見つけても、
その場では修正しない。

代わりに `/docs/todo` の運用ルールに従い、
以下を含む Todo を作成する。

-   優先順位
-   問題の概要
-   原因
-   修正方針
-   対象ファイル
-   そのまま実装へ使用できるプロンプト

Todo 追加自体が現在の依頼範囲に含まれない場合でも、
ルートの `AGENTS.md` と `/docs/todo` のルールに従う。

## 実装後の確認

変更範囲に応じて、以下を実行する。

```bash
cd server
npm run lint
npm run typecheck
```

テストコマンドが対象機能に存在する場合は、関連テストも実行する。

migration は明示的に依頼されない限り実行しない。

実行できなかった確認項目がある場合は、
実行していないことと理由を報告する。

## 禁止事項

-   依頼されていないライブラリ追加
-   依頼されていない設計変更
-   route や controller への DB アクセス追加
-   controller への業務ロジック追加
-   service への HTTP レスポンス処理追加
-   既存 migration の無断変更
-   migration の無断実行
-   `sequelize.sync()` によるスキーマ更新
-   デバッグ用ログの放置
-   型エラー回避目的だけの `any`
-   認証、認可、所有権確認の省略
