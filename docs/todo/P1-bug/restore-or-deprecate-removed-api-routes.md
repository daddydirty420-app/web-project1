# app.ts から削除された API Route の提供継続を確認する

## 原因

PR #77 の `server/src/app.ts` で、多数の Router import と `app.use()` が削除されている。対応する Router ファイルも削除されているため、移行先や廃止手順がない API は merge 後に 404 になる。

例として、`/api/blog`、`/api/chat`、`/api/cancel`、`/api/journal`、`/api/id-card`、`/api/item-buyer-report`、`/api/points-uriage-over`、`/api/point-lots`、`/api/sales-history`、各種 admin API が削除されている。

## 修正方針

削除対象ごとに、実際に廃止済みか、代替 API へ移行済みかを確認する。提供継続が必要な API は Router と `app.use()` を復元する。廃止する API は、クライアント・運用ツール・外部連携からの参照を移行したうえで、バージョニングまたは周知を伴う明示的な廃止として別タスクで実施する。

Route/Controller 分離が目的の場合は、API を削除せず、既存の URL・HTTP メソッド・middleware 順序を維持したまま controller へ移動する。

## 対象ファイル

- `server/src/app.ts`
- `server/src/routes/blog.ts`
- `server/src/routes/chat.ts`
- `server/src/routes/cancel.ts`
- `server/src/routes/id_card.ts`
- `server/src/routes/item_buyer_report.ts`
- `server/src/routes/points_uriage_over.ts`
- `server/src/routes/point_lots.ts`
- `server/src/routes/sales_history.ts`
- `server/src/routes/admin/*`

## Codexへそのまま渡せる実装プロンプト

```
`/server` 配下の AGENTS.md と `/docs/todo/AGENTS.md` を確認してください。

PR #77 で `server/src/app.ts` から削除された API Route を調査してください。削除対象ごとに、クライアント、管理画面、バッチ、外部連携、API ドキュメントから利用状況を確認し、提供継続が必要な API を判定してください。

提供継続が必要な API は、以前と同じ URL・HTTP メソッド・middleware の順序・レスポンスを維持して Router の mount を復元してください。Route/Controller 分離を行う場合も API を削除せず、既存処理を controller へ移動するだけにしてください。

明示的に廃止済みであることを確認できた API は復元せず、廃止根拠と移行先を報告してください。推測で API を廃止しないでください。変更後は `npm --prefix server run lint` と `npm --prefix server run typecheck` を実行してください。
```
