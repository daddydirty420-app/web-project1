FROM node:20-alpine
 
WORKDIR /app
 
# 依存関係のインストール（キャッシュ効率化のため先にコピー）
COPY package*.json ./
RUN npm install
 
# ソースコードをコピー
COPY . .
 
EXPOSE 3000
 
CMD ["npm", "run", "dev"]
