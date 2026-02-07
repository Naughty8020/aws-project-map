import { serve } from '@hono/node-server'; // Node.js環境での起動に必要
import { handle } from 'hono/aws-lambda';
import { cors } from 'hono/cors';
import { Hono } from 'hono';
import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from '@aws-sdk/client-bedrock-runtime';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  GetCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';

/* ======================
   App 初期化
====================== */
const app = new Hono();

// CORSミドルウェア: フロントエンド(5173)からのアクセスを許可
app.use('*', cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
}));

/* ======================
   AWS Clients
====================== */
const bedrock = new BedrockRuntimeClient({
  region: 'ap-northeast-1',
});

const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: 'ap-northeast-1' })
);

/* ======================
   API: Bedrock AI
====================== */
app.get('/api/ai', async (c) => {
  const prompt =
    '清水寺の1月中旬の混雑度（1-10）を予測し、数字1文字のみ出力せよ。解説は厳禁とする。';

  const command = new InvokeModelCommand({
    modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
    contentType: 'application/json',
    accept: 'application/json',
    body: JSON.stringify({
      anthropic_version: 'bedrock-2023-05-31',
      max_tokens: 1000,
      messages: [
        { role: 'user', content: [{ type: 'text', text: prompt }] },
      ],
    }),
  });

  try {
    const response = await bedrock.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    const text = result.content?.[0]?.text ?? '';
    return c.json({ answer: text });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'Bedrock呼び出しに失敗しました' }, 500);
  }
});

/* ======================
   API: DynamoDB 全件取得
====================== */
app.get('/api/events', async (c) => {
  try {
    const result = await ddb.send(
      new ScanCommand({ TableName: 'kyoto_event_a9f3k2' })
    );

    return c.json({
      success: true,
      data: result.Items ?? []
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: 'イベントデータの取得に失敗しました' }, 500);
  }
});

/* ======================
   サーバーの起動設定 (Docker/Local用)
====================== */
// AWS Lambda環境以外（Docker等）で動かすための設定
if (process.env.NODE_ENV !== 'production' || !process.env.LAMBDA_TASK_ROOT) {
  const port = 3000;
  console.log(`🚀 Server is running on http://localhost:${port}`);

  serve({
    fetch: app.fetch,
    port,
    hostname: '0.0.0.0', // Dockerの外部公開に必須
  });
}

// AWS Lambda用のハンドラー
export const handler = handle(app);
export default app;
