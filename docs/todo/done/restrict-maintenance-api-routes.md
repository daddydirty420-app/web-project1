# maintenance API を外部公開しないようにする

## 原因

PR #77 で `server/src/app.ts` に maintenance 用 Router が登録されている一方、各 Router に認証・認可 middleware が設定されていない。

そのため、未認証の利用者でも `PATCH /api/maintenance/notification/type` を実行して全通知の type を変更できる。また、`POST /api/maintenance/suggest-words/create`、`PATCH /api/maintenance/suggest-words/normalize` は検索候補データを全件作成・更新できる。`/api/maintenance/test` にはテストデータの一括作成・更新を行うエンドポイントも公開されている。

## 修正方針

maintenance 用エンドポイントは通常の公開 API にマウントしない。運用上 HTTP 経由で実行する必要がある場合は、管理者認証・認可を必須にし、さらに実行環境を明示的に制限する。

既存の運用方法を確認したうえで、不要な Router 登録を削除するか、管理者専用かつ本番で無効化された経路へ移す。データ更新を行うエンドポイントについては、意図しない再実行を防ぐ設計も確認する。

## 対象ファイル

- `server/src/app.ts`
- `server/src/maintenance/routes/notification.ts`
- `server/src/maintenance/routes/suggestWords.ts`
- `server/src/maintenance/routes/test.ts`
- `server/src/maintenance/routes/item.ts`
- `server/src/maintenance/routes/user.ts`

## Codexへそのまま渡せる実装プロンプト

```
`/server` 配下の AGENTS.md と `/docs/todo/AGENTS.md` を確認してください。

`server/src/app.ts` で公開されている `/api/maintenance/*` の安全性を修正してください。未認証のリクエストから、通知・検索候補・テストデータ・ユーザー情報を操作または取得できないようにしてください。

まず現在の maintenance API の実行主体と本番での運用要件を既存コード・設定から確認してください。通常の公開 API として不要なら `app.ts` から Router の mount を削除してください。HTTP 経由の運用が必要なら、既存の管理者認証・認可 middleware を使い、production 環境では明示的に無効化または強固に保護してください。

URL、既存の公開 API、通常機能の挙動は変更しないでください。maintenance Router 内のデータ更新処理を公開状態のまま残さないでください。変更後は `npm --prefix server run lint` と `npm --prefix server run typecheck` を実行し、既存エラーと今回の変更によるエラーを分けて報告してください。
```
