// backend/src/index.ts
import { handle } from 'hono/aws-lambda';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serve } from '@hono/node-server';

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

// CORS
app.use('/api/*', cors());

/* ======================
   AWS Clients
====================== */

// Bedrock
const bedrock = new BedrockRuntimeClient({
  region: 'ap-northeast-1',
});

// DynamoDB
const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({
    region: 'ap-northeast-1',
  })
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
        {
          role: 'user',
          content: [{ type: 'text', text: prompt }],
        },
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
   API: DynamoDB 個別取得
====================== */
app.get('/api/spots/:spot_id/:updated_at', async (c) => {
  const spot_id = c.req.param('spot_id');
  const updated_at = c.req.param('updated_at');

  if (!spot_id || !updated_at) {
    return c.json({ error: 'spot_id と updated_at が必要です' }, 400);
  }

  try {
    const result = await ddb.send(
      new GetCommand({
        TableName: 'tourist_spots',
        Key: { spot_id, updated_at },
      })
    );

    if (!result.Item) {
      return c.json({ message: 'not found' }, 404);
    }

    return c.json(result.Item);
  } catch (error) {
    console.error(error);
    return c.json({ error: 'DynamoDB取得失敗' }, 500);
  }
});

/* ======================
   API: DynamoDB 全件取得
====================== */
app.get('/api/spots', async (c) => {
  try {
    const result = await ddb.send(
      new ScanCommand({ TableName: 'tourist_spots' })
    );
    return c.json((result.Items ?? []));
  } catch (error) {
    console.error(error);
    return c.json({ error: 'DynamoDB取得失敗' }, 500);
  }
});

/* ======================
   Lambda export
====================== */
export const handler = handle(app);
export type AppType = typeof app;

/* ======================
   ローカル / Docker 用
====================== */
const port = Number(process.env.PORT ?? 3000);

if (process.env.NODE_ENV !== 'production') {
  serve({ fetch: app.fetch, port });
  console.log(`✅ Backend listening on http://localhost:${port}`);
}

