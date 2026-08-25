# AWS アーキテクチャ構成

## 概要

- Region: ap-northeast-1
- Compute: Amazon EC2
- Container Registry: Amazon ECR
- Object Storage: Amazon S3
- Encryption: SSE-S3 / SSE-KMS
- Audit: AWS CloudTrail

## アーキテクチャ構成図

```mermaid
flowchart TB

    %% =========================
    %% External
    %% =========================

    User["👤 User / Browser"]
    Admin["👨‍💻 Administrator"]
    GitHub["GitHub Actions"]

    %% =========================
    %% AWS
    %% =========================

    subgraph AWS["AWS / ap-northeast-1"]

        %% -------------------------
        %% Network
        %% -------------------------

        subgraph VPC["Amazon VPC"]

            IGW["Internet Gateway"]

            subgraph PublicSubnet["Public Subnet"]

                EIP["Elastic IP"]

                SG["Security Group"]

                subgraph EC2["Amazon EC2"]

                    NGINX["NGINX"]

                    subgraph Docker["Docker / Docker Compose"]
                        Next["Next.js<br/>Client"]
                        Express["Express<br/>Server"]
                        PostgreSQL["PostgreSQL"]
                    end

                    NGINX --> Next
                    NGINX --> Express
                    Express --> PostgreSQL
                end

                EIP --> SG
                SG --> EC2
            end

            S3Endpoint["S3 Gateway<br/>VPC Endpoint"]

            EC2 --> S3Endpoint
        end

        %% -------------------------
        %% Container Registry
        %% -------------------------

        ECR["Amazon ECR<br/>client / server repository"]

        %% -------------------------
        %% Storage
        %% -------------------------

        subgraph S3["Amazon S3"]

            ContentBucket["通常コンテンツバケット<br/>SSE-S3"]

            VerificationBucket["本人確認・営業許可証等<br/>証明書バケット<br/>SSE-KMS<br/>VPC Endpoint限定"]
        end

        %% -------------------------
        %% Security
        %% -------------------------

        IAM["EC2 IAM Role<br/>ECR Pull<br/>S3 Access<br/>KMS Access"]

        KMS["AWS KMS<br/>Customer Managed Key"]

        %% -------------------------
        %% Audit
        %% -------------------------

        CloudTrail["AWS CloudTrail<br/>S3 Data Events"]

        %% -------------------------
        %% Future
        %% -------------------------

        subgraph Future["Future / 導入候補"]
            Route53["Amazon Route 53"]
            CloudFront["Amazon CloudFront"]
            ACM["AWS Certificate Manager"]
            CloudWatch["Amazon CloudWatch"]
        end
    end

    %% =========================
    %% Public Access
    %% =========================

    User --> IGW
    Admin --> IGW

    IGW --> EIP

    %% =========================
    %% Deployment
    %% =========================

    GitHub -->|"Build / Push"| ECR
    ECR -->|"Pull"| EC2

    IAM -.->|"IAM Policy"| EC2

    %% =========================
    %% S3 Access
    %% =========================

    Express -->|"通常コンテンツ操作"| ContentBucket

    Express -->|"本人確認書類操作"| S3Endpoint

    S3Endpoint -->|"aws:SourceVpce"| VerificationBucket

    %% User uploads
    User -->|"通常コンテンツ Upload / Download"| ContentBucket
    User -->|"証明書 Upload"| VerificationBucket

    %% Admin access through application
    Admin -->|"証明書閲覧・管理"| EC2

    %% =========================
    %% Encryption
    %% =========================

    VerificationBucket -->|"Encrypt / Decrypt"| KMS
    IAM -.->|"kms:Decrypt<br/>kms:GenerateDataKey"| KMS

    %% =========================
    %% Audit
    %% =========================

    VerificationBucket -.->|"GetObject<br/>PutObject<br/>DeleteObject"| CloudTrail

    %% =========================
    %% Future Architecture
    %% =========================

    User -.-> Route53
    Route53 -.-> CloudFront
    CloudFront -.-> ACM
    CloudFront -.-> EC2
    CloudFront -.-> ContentBucket
    EC2 -.-> CloudWatch
```

### 本人確認・営業許可証バケット 詳細フロー

```mermaid
flowchart LR

    User["👤 User"]
    Admin["👨‍💻 Admin"]

    subgraph VPC["VPC"]
        EC2["EC2 / Express"]
        VPCE["S3 Gateway<br/>VPC Endpoint"]
    end

    S3["証明書S3 Bucket<br/>SSE-KMS"]

    User -->|"Upload Request"| EC2
    Admin -->|"Read / Update / Delete"| EC2

    EC2 --> VPCE
    VPCE --> S3
```

## ネットワーク

### VPC

### パブリックサブネット

### インターネットゲートウェイ

### Elastic IP

### セキュリティーグループ

### S3 Gateway VPC Endpoint

## コンピューティング

### EC2

- NGINX
- Docker
- Docker Compose
- Next.js
- Express
- PostgreSQL

### EC2の公開経路

- Elastic IPをEC2へ関連付け
- HTTP/HTTPS通信はNGINXで受け付ける
- `/app` はNext.js、`/api` はExpressへリバースプロキシ

## コンテナ

### ECR

- client repository
- server repository

```
GitHub Actions
↓
ECR
↓
EC2
```

## ストレージ

### S3

- 通常コンテンツバケット
- 本人確認・営業許可証等証明書バケット

本人確認・営業許可証バケットは、ユーザーは書き込みのみ、管理者は全操作可。

### VPC Endpoint Restricted Bucket

本人確認・営業許可証バケットは特定のVPC Endpoint経由のみアクセス可能。

### Encryption

通常コンテンツバケットはSSE-S3を使用する。

本人確認・営業許可証バケットはSSE-KMSを使用する。

### 本人確認・営業許可証バケットへの読み取りアクセス経路

本人確認・営業許可証バケットへの読み取りは、
EC2からS3 Gateway VPC Endpoint経由で行う。

ユーザーへS3オブジェクトのパスを直接公開しない。

## IAM

### EC2 IAM Role

- ECR Pull
- S3 Access
- KMS Decrypt / GenerateDataKey

## 証跡

### CloudTrail

本人確認・営業許可証バケットのみS3 Data Eventsを記録する。

対象:

- GetObject
- PutObject
- DeleteObject

## 今後導入するかもしれないアーキテクチャ

- Amazon Route 53
- Amazon CloudFront
- Amazon CloudWatch
- AWS Certificate Manager
