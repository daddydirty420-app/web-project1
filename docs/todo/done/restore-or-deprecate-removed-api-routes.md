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

---

## PR #77 Router mount 削除の調査結果

### 結論

- `server/src/app.ts` への Router mount 復元は不要。
- 削除された実処理を持つ Router は、`server/src/prototype` または `server/src/maintenance` へ移動済みであり、用途別の意図的な分離と判断した。
- 削除された空 Router は HTTP ハンドラーを持たず、API を提供していなかった。
- maintenance Router は認証なしで保守処理やテストデータ操作を行うため、通常の公開 API として mount してはいけない。

### 確認内容

- 現行 `server/src/app.ts` に prototype / maintenance Router の import・mount はない。
- prototype / maintenance 配下に HTTP 公開を行う `index.ts` はない。
- 旧 Router と移動先について、import、HTTP メソッド、パス、middleware、処理本体、UseCase を比較した。
- `prototype` には旧 item-list-old、blog、journal、item-buyer-report、および旧管理 Router が移動している。
- `maintenance` には旧 dev/test、dev/users、dev/items が移動している。

### 作業結果

- 作業ツリーへのコード・設定変更なし。
- lint / typecheck はコード変更がないため未実行。
