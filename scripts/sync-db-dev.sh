#!/usr/bin/env bash
set -euo pipefail

# 設定

LOCAL_CONTAINER="my_postgres"
LOCAL_DB="neondb"
LOCAL_USER="neondb_owner"

EC2_HOST="web1"
EC2_USER="ubuntu"
REMOTE_PROJECT_DIR="~/web-project1"

REMOTE_CONTAINER="my_postgres"
REMOTE_DB="webproject1"
REMOTE_USER_DB="postgres"

DUMP_FILE="local-docker-db-$(date +%F_%H-%M-%S).dump"

# 1. ローカルDBをdump

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

# 2. EC2へ送信

echo "Uploading dump..."

scp ./${DUMP_FILE} \
${EC2_USER}@${EC2_HOST}:~/

# 3. EC2で復元

echo "Running migrations and restoring DB..."

ssh ${EC2_HOST} << EOF

echo "Running migrations..."
docker exec ${REMOTE_SERVER_CONTAINER} npm run migration:run

echo "Copying dump..."
docker cp \
~/${DUMP_FILE} \
${REMOTE_CONTAINER}:/tmp/${DUMP_FILE}

echo "Restoring database..."
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

# 4. ローカルdump削除

rm ./${DUMP_FILE}

echo "DB Sync Complete!"