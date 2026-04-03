FROM node:22

# ffmpegとffprobeをインストール
RUN apt-get update && apt-get install -y ffmpeg

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