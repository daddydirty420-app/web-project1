# items/relation/brands.md

## GET /brands/suggest — 商品報告作成

### リクエスト

- params:
    - keyword

### ビジネスロジック

- keyword正規化
- Brands取得
- BrandAliases取得
- Brands・BrandAliases配列化

### レスポンス

- brands
