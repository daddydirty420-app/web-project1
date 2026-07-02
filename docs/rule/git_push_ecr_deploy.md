# Git push & EC2 deployルール

## Git push

### ローカル developブランチ

```
git add .
git commit -m "..."
git push origin develop
```

- gitにコード変更を追加（git add）
- commitに変更点等のコメントを書く（git commit -m "..."）
- developブランチにpush（git push origin develop）

#### コミットルール

- fix：バグ修正
- hotfix：クリティカルなバグ修正
- add：新規（ファイル）機能追加
- update：機能修正（バグではない）
- change：仕様変更
- clean：整理（リファクタリング等）
- disable：無効化（コメントアウト等）
- remove：削除（ファイル）
- upgrade：バージョンアップ
- revert：変更取り消し
- docs：ドキュメント
- styles：css調整

---

## Git marge ~ EC2自動デプロイ

### 操作方法

ローカルの **~/project** ターミナルで実行

```
./scripts/release.sh
```

---

### release.shの内容

```
#!/bin/bash

set -e

trap 'git checkout develop' EXIT

git checkout main
git merge develop
git push origin main

echo "🎉 Release complete!"
```

- mainブランチにチェックアウト（git checkout main）
- developブランチの変更をmainブランチにマージ（git merge develop）
- mainブランチに変更内容をpush（git push origin main）

- 作業環境をdevelopブランチに戻す（git checkout develop）

**trap 'git checkout develop' EXIT**で、EXITトラップによりエラーで止まっても最終的に作業環境がdevelopに戻るようにする

---

### release.shの変更方法

```
nano scripts/release.sh
```

これをローカルの **~/project** ターミナルで実行

内容を変更したら

- **ctrl + 0**で保存
- **ctrl + x**で閉じる

---

### docker-ecr.ymlの内訳・EC2自動デプロイ

Github Actions（docker-ecr.yml）の詳細は<u>github_actions.md</u>に記載。ここではEC2デプロイ部分のみ説明する。

docker-ecr.yml（Deploy to EC2）の記載内容

```
# deploy
- name: EC2 to Deploy
  uses: appleboy/ssh-action@v1
  with:
    host: ${{ secrets.EC2_HOST }}
    username: ubuntu
    key: ${{ secrets.EC2_PRIVATE_KEY }}
    script: |
      cd ~/web-project1
      ./scripts/deploy.sh
```

実行スクリプトは **~/web-project1/scripts/deploy.sh** を参照。ここではデプロイ先EC2の場所やEC2認証、 **~/web-project1/scripts/deploy.sh** のスクリプトを実行するという指示を書いている。

#### EC2_HOST、EC2_PRIVATE_KEYの変更方法

1. githubのリポジトリから **settings** を開き、**Secrets and variables** の **Actions** を開く。
2. **EC2_HOST** または **EC2_PRIVATE_KEY** のペンのマークをクリックし、設定画面で編集する。

各キー内訳

- EC2_HOST: IPアドレスまたはDNS
- EC2_PRIVATE_KEY: web1server_key.pemのキー、内容そのままコピー

**web1server_key.pem** のアクセス、キー取得方法

```
/home/conta/.ssh/web1server_key
```

手っ取り早く探すなら ↓

```
find ~ -name "web1server-key.pem"
```

---

### 自動デプロイ deploy.sh 内容

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

echo "Pull latest images..."
docker compose -f docker-compose.prod.yml pull

echo "Restart containers..."
docker compose -f docker-compose.prod.yml up -d --remove-orphans

echo "Remove unused images..."
docker image prune -f

echo "=== Deploy Complete ==="
```

1. ECRログイン
2. 最新のECRイメージをdocker-composeにpull
3. コンテナを再起動
4. 古い未使用のECRイメージを削除

---

### deploy.sh変更方法

ec2ターミナルで実行

```
nano scripts/deploy.sh
```

- **ctrl + 0**で保存
- **ctrl + x**で閉じる

---

## デプロイエラー確認方法

### 成功＆エラー確認

- githubのリポジトリから **Actions** でチェック
- ECRに最新イメージあるか確認
