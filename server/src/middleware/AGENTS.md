## このディレクトリについて

認証・認可、入力値検証、レート制限など、Route と Controller の間で実行する Express Middleware を配置するディレクトリです。

Middleware はリクエストの前処理と共通の判定を担当し、業務ロジックは持たせません。

```
middleware/
├── authMiddleware.ts     # JWT を必須で検証し、認証ユーザーを req.user に設定
├── authOptional.ts       # JWT がない場合も許可し、取得できたユーザーを req.user に設定
├── isAdmin.ts            # 認証ユーザーの管理者権限を確認
├── session.ts            # セッション ID の発行と req.sessionId への設定
├── index.ts              # 共通 Middleware の re-export
├── rateLimit/            # 各 Route に適用するレート制限
└── validate/             # body・params・query の Zod バリデーション
```

## Route との関係

```
Request
    ↓
Route
    ↓
Middleware（認証・認可・レート制限・入力値検証）
    ↓
Controller
```

- Route で必要な Middleware を選び、Controller より前に指定する。
- Middleware は記述順に実行されるため、前段の処理結果に依存する場合は順序を守る。
- `isAdmin` は `authenticateToken` より後に指定する。
- `req.user` をキーにするレート制限は、ユーザー情報を設定する認証 Middleware より後に指定する。
- 既存 Route を修正する場合は、挙動を変えないよう Middleware の種類と順序を維持する。

## 認証・認可

- 認証必須の Route では `authenticateToken` を使用する。
- 未認証ユーザーも利用でき、認証情報がある場合のみ利用する Route では `authenticateOptional` を使用する。
- 管理者 Route では `authenticateToken` の後に `isAdmin` を使用する。
- 認証結果は `req.user` から利用する。

## rateLimit

機能ごとにレート制限を定義し、対象の Route に個別に適用します。

詳細は `rateLimit/AGENTS.md` に従ってください。

## validate

- Zod スキーマは `validators` 配下に定義し、Route から `validateBody`、`validateParams`、`validateQuery` へ渡す。
- 検証済みの値はそれぞれ `req.validatedBody`、`req.validatedParams`、`req.validatedQuery` に設定する。
- バリデーション Middleware は、検証済みの値を使用する Controller より前に指定する。
- 検証失敗時は既存の `AppError` を使用し、400 エラーとして扱う。

## 基本方針

- 新しい Middleware を作成する前に、既存の共通 Middleware で対応できないか確認する。
- Request の型を拡張する場合は、既存の `express-serve-static-core` の宣言拡張に合わせる。
- エラーは直接握りつぶさず、既存の方法に合わせてレスポンスするかエラーハンドラーへ渡す。
- 新規実装は既存ファイルの命名、ESM の import、構成に合わせる。
