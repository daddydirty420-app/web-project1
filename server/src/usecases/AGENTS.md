# /server/src/usecases/AGENTS.md

## 対象

このディレクトリ内の Usecase を作成・修正する場合に適用する。

## Usecase 層の位置づけ

バックエンドは原則として、以下の責務分離に従う。

```text
フロントエンド
↓
Router（ルーティング）
↓
Controller（リクエスト・レスポンス処理）
↓
Usecase（業務ロジック）
↓
Service（DBアクセス）
↓
DB
```

Usecase 層は、Controller から受け取った値をもとに業務処理を組み立て、必要な Service を呼び出して処理結果を返す層とする。

## Usecase が担当する処理

Usecase では主に以下を担当する。

-   業務ルールに基づく判定
-   複数の Service を組み合わせた処理
-   処理順序の制御
-   条件分岐
-   データの組み立て・変換
-   業務上必要な計算
-   所有権や状態など、業務上必要なチェック
-   必要に応じた `AppError` の送出
-   Controller へ返す結果の組み立て

単純な DB 取得・作成・更新・削除のみで完結する処理は、可能な限り Service に配置する。

## Usecase が担当しない処理

以下の処理は原則として Usecase に実装しない。

-   Express の `Request` / `Response` / `NextFunction` の操作
-   `req.body` / `req.params` / `req.query` / `req.user` などへの直接アクセス
-   `res.status()` / `res.json()` などのレスポンス処理
-   Router の定義
-   Sequelize Model を使用した直接の DB アクセス
-   HTTP ステータスコードやレスポンス形式そのものの制御
-   リクエスト入力値の schema validation

HTTP に依存する処理は Controller、DB アクセスは Service、入力値の検証は Validator の責務とする。

## 引数

Usecase のメイン関数は、原則としてオブジェクト形式の引数を使用する。

```ts
type Params = {
    userId: number;
    itemId: number;
};

export const exampleUseCase = async ({ userId, itemId }: Params) => {
    // ...
};
```

Controller から Usecase へは、必要な値だけを渡す。

Express の `Request` オブジェクトそのものを Usecase へ渡さない。

## 型

-   `any` は原則として使用しない。
-   Usecase の入力値は `Params` などで明示的に型定義する。
-   Service へ渡すデータについても、可能な限り Service 用の型を使用する。
-   型エラーを回避する目的だけで型アサーションを追加しない。
-   実際に取り得る値を表す具体的な型を優先する。

## Service の利用

DB へのアクセスが必要な場合は、Service を経由する。

Usecase から以下を直接行わない。

```ts
User.findByPk(...)
User.findOne(...)
User.create(...)
User.update(...)
User.destroy(...)
```

必要な取得・作成・更新・削除処理が Service に存在しない場合は、責務を確認したうえで適切な Service を作成または追加する。

ただし、現在依頼されている作業範囲を超える変更は行わない。

## エラー処理

業務条件を満たさない場合は、必要に応じて `AppError` を使用する。

例:

```ts
if (!item) {
    throw new AppError("ITEM_NOT_FOUND", 404);
}
```

単純な DB エラーを Usecase 内で不要に握りつぶさない。

`try/catch` は、エラーを別の意味へ変換する必要がある場合や、追加処理が必要な場合など、明確な理由がある場合のみ使用する。

## コメント

Controller と接続するメインの Usecase 関数の直上には、原則として以下の 3 行コメントを記載する。

```ts
// パス
// summary: ...
// page: ...
```

コメントには以下を記載する。

-   パス（`/api` 以下）
-   処理概要
-   フロントの対応ページ

現時点で 3 行コメントが存在しない既存 Usecase については、今回の作業対象でなければ追加しなくてよい。

3 行コメントの内容は Route を正とする。

Route、Controller、Usecase 間でコメント内容が異なる場合は、Route の内容に合わせる。

ただし、コメント修正が現在の依頼範囲外である場合は、スコープ管理ルールに従う。

## 関数分割

Usecase のメイン関数が大きくなりすぎる場合は、処理単位で関数を分割する。

その Usecase 内だけで使用する処理は、同一ファイル内の private 相当の関数として定義してよい。

複数の Usecase から共通利用される処理については、責務を確認したうえで共通 Usecase、shared、Service など適切な場所への分離を検討する。

単にコード量を減らす目的だけで共通化せず、業務上同じ責務である場合のみ共通化する。

## 既存コードを修正する場合

-   現在依頼されている目的に必要な範囲のみ変更する。
-   無関係なリファクタを同時に行わない。
-   既存の挙動を変更する場合は、依頼内容から必要であることを確認する。
-   命名やディレクトリ構成を独自判断で大きく変更しない。
-   周辺コードに問題を発見しても、現在の作業と無関係であれば修正しない。

## コーディング規約

以下の規約に従って実装する。

`/docs/rule/backend/coding_rule/usecase.md`

未作成の場合は、この `AGENTS.md`、ルートの `AGENTS.md`、既存コードの記述方針を優先する。

既存コードとルールが矛盾する場合は、より上位の `AGENTS.md` と明示された規約を優先する。

## スコープ管理

現在依頼されている範囲以外は変更しない。

作業中に今回のタスクと無関係な以下の問題を発見しても、その場では修正しない。

-   バグ
-   セキュリティ上の問題
-   リファクタ候補
-   設計上の改善点
-   技術的負債
-   将来的な改善案

代わりに `/docs/todo` の `AGENTS.md` に従い、適切な優先度フォルダへ新しい Todo を作成する。

Todo は、ファイル全体をそのまま Codex などへ渡して実装指示として使用できる内容にする。

Todo の追加自体が現在の依頼範囲に含まれていない場合でも、ルートの `AGENTS.md` および `/docs/todo` のルールに従って作成する。
