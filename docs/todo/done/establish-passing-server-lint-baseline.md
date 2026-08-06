# server lint を成功する基準へ整える

## 原因

PR #77 で `server/eslint.config.mjs` と `npm run lint` が導入・更新されているが、PR 差分を含む server コードには lint エラーが残っている。

Route/Controller 分離で追加された Controller には未使用の `next`、コメント内の不正な空白などがあり、さらに config・maintenance・model・usecase などにもルール違反がある。この状態では lint を CI の品質ゲートとして利用できない。

## 修正方針

ESLint 設定と対象ファイルの責務を確認し、実行対象として意図した server コードが `npm run lint` で成功する状態にする。

本番コードの違反は、挙動を変えない最小限の修正を優先する。設定ファイルや生成物など、ESLint の対象外にすることが妥当なファイルは、理由を明確にして ignore 設定へ追加する。型安全性を落とすためだけの `any`、無効化コメント、ルール緩和は行わない。

## 対象ファイル

- `server/eslint.config.mjs`
- `server/package.json`
- `server/config/config.cjs`
- `server/src/controllers/*`
- `server/src/routes/*`
- lint 出力で指摘される server 配下のファイル

## Codexへそのまま渡せる実装プロンプト

```
`/server` 配下の AGENTS.md と、変更対象ディレクトリの AGENTS.md を確認してください。

`npm --prefix server run lint` が成功するように、server の lint 基準を整備してください。まず lint を実行し、各エラーが実装修正・ESLint の対象除外・設定修正のどれに該当するかを判断してください。

実装を修正する場合は、処理内容や API 仕様を変えない最小限の変更にしてください。`any` の追加、安易な eslint-disable、ルールの全面的な緩和は禁止です。ESLint の対象外にする場合は、設定ファイルや生成物など、除外が妥当な理由を確認してから限定的に設定してください。

特に `server/src/controllers` と `server/src/routes` は、未使用 import・未使用引数・不正な空白を解消し、Route/Controller の責務分離ルールを維持してください。変更後は `npm --prefix server run lint` と `npm --prefix server run typecheck` を実行し、結果を報告してください。
```

---

## 報告

確認しました。問題ありません。

- npm --prefix server run lint: 成功
- npm --prefix server run typecheck: 成功

変更は行っていません。
