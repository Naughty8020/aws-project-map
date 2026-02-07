# Node 20 Alpine ベース
FROM node:20-alpine

# 作業ディレクトリ
WORKDIR /app

# ビルドに必要なパッケージ
RUN apk add --no-cache bash curl

# package.json をコピーして依存関係インストール
COPY package*.json ./
RUN npm ci

# アプリソースをコピー
COPY . .

# 環境変数読み込み用
# (dotenv を使っている場合)
ENV NODE_ENV=development

# ポート公開
EXPOSE 3000

# ローカル開発用コマンド
CMD ["npm", "run", "dev"]

