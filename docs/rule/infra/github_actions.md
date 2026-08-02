# Github Actions ワークフロー

## 全体の流れ

### 使用するファイル

```
/project/github/workflows/docker-ecr.yml
```

### ユーザー操作

githubのPRからmainにマージすると、自動でCI/CD（github actions）が作動する。

### Github Actions概要

buildとpushをECRに、deployをEC2に行うものである。

#### 流れ

1. Github Actionsにチェックアウト
2. AWS認証
3. ECRにログイン
4. /clientをbuild & push
5. /serverをbuild & push
6. EC2にdeploy

---

## on

gitでpushを検知するブランチの設定（ここではmainを使用）

```
on:
    push:
        branches: ["main"]
```

## env

docker-ecr.yml内で使用する環境変数の設定

```
env:
    AWS_REGION:
    ECR_REGISTRY:
    CLIENT_REPO:
    SERVER_REPO:
```

## jobs

### build

```
jobs:
    build:
        runs-on: ubuntu-latest

        steps:
            各処理ステップを記載
```

- runs-on: imageのOS（AMI）
- steps: Github Actionsで行う処理を順番に記載

---

## Github Actions build steps

### Checkout

```
- name: Checkout
  uses: actions/checkout@v4
```

Github Actionsにチェックアウト

### Configure AWS credentials

AWS認証

```
- name: Configure AWS credentials
  uses: aws-actions/configure-aws-credentials@v4
  with:
    aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    aws-region: ${{ env.AWS_REGION }}
```

secrets

- Github Secretsに設定、アクセスキーの取得はAWSのIAMで行う

### Login to ECR

ECRにログイン

```
- name: Login to ECR
  run: |
    aws ecr get-login-password --region ${{ env.AWS_REGION }} | \
    docker login --username AWS --password-stdin $ECR_REGISTRY
```

### Build & Push client

/clientをECRにビルド、プッシュ

```
# client
- name: Build & Push client
  run: |
    docker build -t $ECR_REGISTRY/$CLIENT_REPO:latest ./client
    docker build -t $ECR_REGISTRY/$CLIENT_REPO:${{ github.sha }} ./client
    docker push $ECR_REGISTRY/$CLIENT_REPO:latest
    docker push $ECR_REGISTRY/$CLIENT_REPO:${{ github.sha }}
```

最新版を意味する:latestと、バックアップ用の:${{ github.sha }}を作成し、ECRにイメージを保存（ECRのライフサイクルポリシーにより、イメージの最大保管量は**5個**）

### Build & Push Server

/serverをECRにビルド、プッシュ

```
# server
- name: Build & Push server
  run: |
    docker build -t $ECR_REGISTRY/$SERVER_REPO:latest ./server
    docker build -t $ECR_REGISTRY/$SERVER_REPO:${{ github.sha }} ./server
    docker push $ECR_REGISTRY/$SERVER_REPO:latest
    docker push $ECR_REGISTRY/$SERVER_REPO:${{ github.sha }}
```

### Deploy

EC2にデプロイ

```
#!/bin/bash

set -e

echo "=== Deploy Start ==="

cd ~/web-project1

echo "Login to ECR..."
aws ecr get-login-password --region ap-northeast-1 \
| docker login \
    --username AWS \
    --password-stdin 221082170856.dkr.ecr.ap-northeast-1.amazonaws.com

echo "Clean old Docker cache..."
docker system prune -af

echo "Pull latest images..."
docker compose -f docker-compose.prod.yml pull

echo "Restart containers..."
docker compose -f docker-compose.prod.yml up -d --remove-orphans

echo "=== Deploy Complete ==="
```

1. ECRログイン
2. 古い未使用のECRイメージを削除
3. 最新のECRイメージをdocker-composeにpull
4. コンテナを再起動

---

## Github Actions 成功・エラー確認

githubのリポジトリから **Actions** でチェック

成功したら ↓

- ブラウザで動作確認

失敗したら ↓

- Github Actionsのログで原因調査
- ECRに最新イメージあるか確認

## 主なエラー原因

#### ECRログイン

- アクセスキー間違い
- REGION間違い

#### EC2デプロイ

- EC2容量不足
- deploy.shスクリプトミス
- EC2のIAM権限

#### その他

- EC2インスタンス起動していない
