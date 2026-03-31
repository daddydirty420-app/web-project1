FROM node:20

WORKDIR /app

# package.jsonコピー
COPY package*.json ./

# 依存インストール
RUN npm install

# ソースコピー
COPY . .

# ポート
EXPOSE 5000

# 開発用起動
CMD ["npm", "run", "dev"]