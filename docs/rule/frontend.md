# Frontend Rules

## API Fetch

- API Fetch層の関数の命名は必ずfetch~から始める
- バックエンドからレスポンスがある場合、必ずAPI Fetch層で型を明示

### Client

#### Error Handling

- バックエンドから返ってくるエラーメッセージを表示しない
- UI側でユーザーに向けたメッセージをtoastで表示する
- statusCode別でエラーメッセージを分岐する
- システム内部情報を表示しない

---
