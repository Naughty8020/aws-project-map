/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "awsmap-app",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws", // ここでAWSを使うことを指定
    };
  },
  async run() {
    // Honoバックエンド（Lambda）の定義
    const api = new sst.aws.Function("MyApi", {
      handler: "backend/src/index.handler",
      url: true,
      timeout: "1 minute",
      permissions: [
        {
          actions: ["bedrock:InvokeModel"],
          resources: ["*"],
        },
      ],
    });

    // 完了時にURLを表示する
    return {
      api_url: api.url,
    };
  },
});
