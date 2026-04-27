# user/relation/bankAccount.md

## POST /bank-account/shop/:id — ショップ口座情報作成

### リクエスト

- params:
    - shopId
- body:
    - bankName
    - branch
    - accountType
    - accountNumber
    - meigi

### ビジネスロジック

- ショップ情報取得
- body空チェック
- 銀行名照合
- 支店名照合
- 口座種別マスター照合
- DB作成

## PATCH /bank-account/:id — 口座情報変更

### リクエスト

- params:
    - accountId
- body:
    - bankName
    - branch
    - accountType
    - accountNumber
    - meigi

### ビジネスロジック

- 銀行名照合
- 支店名照合
- 口座情報取得
- 口座種別マスター照合
- DB更新

---

## GET /bank-account/myaccount — 口座情報取得

### ビジネスロジック

- 口座情報取得

### レスポンス

- data(口座情報)

---

## GET /banks/search — 銀行名検索

### リクエスト

- query:
    - keyword

### ビジネスロジック

- 銀行全件取得
- 銀行名検索
    - filter
    - map

### レスポンス

- banks

---

## GET /branches/search — 支店名検索

### リクエスト

- query:
    - keyword
    - bankCode

### ビジネスロジック

- 支店名全件取得
- 支店名検索
    - filter
    - map

### レスポンス

- branches
