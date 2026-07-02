# DBバックアップ作成・移行手順

## バックアップ作成

1. docker exec my_postgres pg_dump \
   -U ユーザー名 \
   -d db名 \
   -Fc \
   --no-owner \
   -f /tmp/db名.dump
     - バックアップ.dumpファイル作成

2. docker exec ユーザー名 ls -lh /tmp/db名.dump
    - （確認）

3. docker cp ユーザー名:/tmp/db名.dump .
    - /tmpコンテナからプロジェクトフォルダへコピー

4. ls -lh db名.dump
    - （プロジェクトフォルダ確認）

---

## EC2移行

1. scp -i ~/.ssh/○○.pem \
  db名.dump \
  ubuntu@<Elastic-IP>:~/
    - EC2にコピー

2. ls -lh
    - （確認）

3. ssh web1
    - ここからec2側で操作

4. docker cp ~/db名.dump ユーザー名:/tmp/
    - コンテナへコピー

5. docker exec my_postgres pg_restore \
  -U ユーザー名 \
  -d db名 \
  --clean \
  --if-exists \
  --no-owner \
  /tmp/db名.dump
