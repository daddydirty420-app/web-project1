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