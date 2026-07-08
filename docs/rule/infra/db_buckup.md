./scripts/sync-db-dev.sh

# DBバックアップ手順

## ユーザー操作

ローカルdockerのターミナルで実行

```
./scripts/sync-db-dev.sh
```

実行権限が無い場合

```
chmod +x scripts/sync-db-dev.sh
```

### スクリプト設定時

ローカルのターミナルから編集

```
nano scripts/sync-db-dev.sh
```

---

## エラー発生時

```
set -euo pipefail
```

- -euo エラー、存在しない変数が出たら処理を終了
- pipefail パイプ処理の途中で失敗してもエラー扱い

---

## 環境変数設定

```
LOCAL_CONTAINER=
LOCAL_DB=
LOCAL_USER=

EC2_HOST=web1
EC2_USER=
REMOTE_PROJECT_DIR=

REMOTE_CONTAINER=
REMOTE_DB=
REMOTE_USER_DB=

DUMP_FILE="local-docker-db-$(date +%F_%H-%M-%S).dump"
```

ローカルdb、ec2dbそれぞれのdb名、ユーザー名等の場所を記載

- dockerのdb名がNeonのままになっているので変更可能性あり
- dumpファイル名はlocal-docker-db-2026-07-03_14-25-30.dumpのようなファイル名

---

## DB反映処理プロセス

### ローカルDBをdumpファイルにバックアップ

```
echo "Creating local dump..."

docker exec ${LOCAL_CONTAINER} \
pg_dump \
-U ${LOCAL_USER} \
-d ${LOCAL_DB} \
-Fc \
-f /tmp/${DUMP_FILE}

docker cp \
${LOCAL_CONTAINER}:/tmp/${DUMP_FILE} \
./${DUMP_FILE}

docker exec ${LOCAL_CONTAINER} rm /tmp/${DUMP_FILE}
```

1. pg_dumpでバックアップファイル（.dump）作成
2. cpでdockerからWSLへdumpファイルをコピー
3. rmでdockerのdumpファイルを削除

### EC2へdumpファイルを送信

```
echo "Uploading dump..."

scp ./${DUMP_FILE} \
${EC2_USER}@${EC2_HOST}:~/
```

### EC2でdumpファイルからデータを復元

```
echo "Restoring DB..."

ssh ${EC2_HOST} << EOF

docker cp \
~/${DUMP_FILE} \
${REMOTE_CONTAINER}:/tmp/${DUMP_FILE}

docker exec ${REMOTE_CONTAINER} \
pg_restore \
-U ${REMOTE_USER_DB} \
-d ${REMOTE_DB} \
--clean \
--if-exists \
--no-owner \
--no-privileges \
/tmp/${DUMP_FILE}

docker exec ${REMOTE_CONTAINER} rm /tmp/${DUMP_FILE}

rm ~/${DUMP_FILE}

EOF
```

1. ssh EC2へログイン、これ以降の処理はEC2内で行われる
2. cpでEC2からEC2内のdockerへコピー
3. restore dumpファイルの内容をEC2のDBへ反映
- --clean --if-exists EC2dockerの既存テーブルを存在するときだけ全削除
- --no-owner --no-privileges ユーザー名が違うため、権限無しで操作できるようにする
4. Dockerからdumpファイル削除
5. EC2内のdumpファイル削除

### ローカルdumpファイル削除

```
rm ./${DUMP_FILE}
```

PC内からもdumpファイル削除
