# cron/AGENTS.md

## 対象

このディレクトリ内の Cron を作成・修正する場合に適用する。

## 基本方針

- Cron の実装方法は `buyDelete.ts` を正とし、命名・構成・記述形式を合わせる。
- Cron は定期実行のスケジュール定義と UseCase の呼び出しを担当する。
- 主なビジネスロジックは UseCase 層に実装し、Cron に直接書かない。
- DB アクセスが必要な処理は、UseCase から Service を経由して行う。

## 実装ルール

- `node-cron` を使用する。
- Cron を開始する関数は名前付き export にする。
- スケジュールする処理の直上に、処理内容を示す 1 行コメントを記載する。
- `cron.schedule` の `timezone` には、必ず `"Asia/Tokyo"` を指定する。
- 定期実行する処理は `async` 関数とし、`try/catch` でエラーを捕捉する。
- 実行結果や処理件数などの `console.log` と、実行エラーの `console.error` は Cron に記載する。
- ログの先頭には `[cron]` を付け、対象と結果が分かる文章にする。
- Cron から Sequelize Model や Service を直接呼び出さない。
- 新しい Cron を追加する場合は、既存の構成に合わせて `index.ts` から開始関数を呼び出す。

## スコープ管理

- 現在依頼されている範囲以外は変更しない。
- 無関係なバグ、改善点、リファクタ候補はその場で修正しない。
- 対象外の問題は、ルートの `AGENTS.md` と `/docs/todo/AGENTS.md` に従って Todo に記録する。
