# コメント作成Routeで validateBody が未適用

## 優先順位

P1-bug

## 問題の概要

`/server/src/routes/comment.ts` のコメント作成APIで `req.validatedBody` を参照しているが、Route に `validateBody(...)` middleware が設定されていない。

## 原因

コメント作成Routeは `validateParams` と `validateQuery` のみを設定しており、body の検証・格納処理が Route で抜けている。

## 修正方針

コメント作成Routeに、コメント本文用の schema を使った `validateBody(...)` middleware を追加する。

Controller 側では既存どおり `req.validatedBody` を参照する。

## 対象ファイル

- `/server/src/routes/comment.ts`
- `/server/src/controllers/comment.ts`
- 必要であれば `/server/src/validators/body/comment.ts`

## Codexへそのまま渡せる実装プロンプト

```text
/server/src/routes/comment.ts のコメント作成APIについて、既存挙動を維持したまま body バリデーション漏れを修正してください。

要件:
- POST /comment/:id の Route に validateBody(...) を追加する
- 既存の middleware 順序は周辺実装に合わせて最小変更に留める
- req.validatedBody as CreateCommentBody を使う既存 Controller の処理は維持する
- 必要なら /server/src/validators/body/comment.ts の schema を参照・追加する
- それ以外の責務分離やリファクタは行わない

変更後は以下を実行して結果を報告してください。
- npm --prefix server run lint
- npm --prefix server run typecheck
```

---

## 報告

/server/src/routes/comment.tsに、validatedBody追加。

lint、typecheck問題なし。
