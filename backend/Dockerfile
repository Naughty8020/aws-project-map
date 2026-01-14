FROM node:20-slim
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Honoのポート（設定に合わせて変更してください）
EXPOSE 3000
CMD ["npm", "run", "dev"]
