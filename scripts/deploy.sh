#!/bin/bash

set -e

echo "=== Deploy Start ==="

cd ~/web-project1

echo "Pull latest images..."
docker compose -f docker-compose.prod.yml pull

echo "Restart containers..."
docker compose -f docker-compose.prod.yml up -d --remove-orphans

echo "Remove unused images..."
docker image prune -f

echo "=== Deploy Complete ==="