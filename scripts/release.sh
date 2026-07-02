#!/bin/bash
set -e

trap 'git checkout develop' EXIT

git checkout main
git merge develop
git push origin main

echo "🎉 Release complete!"

