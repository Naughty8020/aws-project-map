import { serve } from '@hono/node-server';
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
  ScanCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb';

// 作成した型をインポート
import { Spot, ApiResponse, BedrockResponse } from './types/spot';

const app = new Hono();

app.use('*', cors({
  origin: 'http://localhost:5173',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 600,
}));

/* ======================
   AWS Clients
====================== */
const bedrock = new BedrockRuntimeClient({ region: 'ap-northeast-1' });
const ddb = DynamoDBDocumentClient.from(
  new DynamoDBClient({ region: 'ap-northeast-1' })
);

const SPOTS_TABLE = 'kyoto_event_a9f3k2'; // テーブル名を統一

/* ======================
   API: S3データ + AI解析してDynamoDBを更新 (同期用)
====================== */
app.post('/api/sync-spots', async (c) => {
  try {
    const s3Res = await fetch('https://kyoto-tourist-data.s3.amazonaws.com/spots.json');
    if (!s3Res.ok) throw new Error('S3 fetch failed');
    const spots = (await s3Res.json()) as Spot[];

    const updatedSpots = await Promise.all(spots.map(async (spot) => {
      const prompt = `${spot.name}の今日の混雑度を1-100の数値で予測し、数字のみ出力せよ。解説は厳禁。`;

      const command = new InvokeModelCommand({
        modelId: 'anthropic.claude-3-haiku-20240307-v1:0',
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: 10,
          messages: [{ role: 'user', content: [{ type: 'text', text: prompt }] }],
        }),
      });

      try {
        const aiRes = await bedrock.send(command);
        const result = JSON.parse(new TextDecoder().decode(aiRes.body)) as BedrockResponse;
        const aiScore = parseInt(result.content?.[0]?.text.trim() || "0");
        const newSpot = { ...spot, crowd: isNaN(aiScore) ? spot.crowd : aiScore };
        console.log(`Updated ${spot.name}: ${spot.crowd} -> ${newSpot.crowd}`);

        // // DynamoDBに保存
        // await ddb.send(new PutCommand({
        //   TableName: SPOTS_TABLE,
        //   Item: newSpot,
        // }));

        return newSpot;
      } catch (e) {
        return spot;
      }
    }));

    return c.json<ApiResponse<Spot[]>>({ success: true, data: updatedSpots });
  } catch (error) {
    return c.json<ApiResponse<never>>({ success: false, data: [] as never, error: 'Sync failed' }, 500);
  }
});

/* ======================
   API: DynamoDBから全件取得 (フロントエンド表示用)
====================== */
app.get('/api/events', async (c) => {
  try {
    const result = await ddb.send(new ScanCommand({ TableName: SPOTS_TABLE }));
    return c.json<ApiResponse<Spot[]>>({
      success: true,
      data: (result.Items as Spot[]) ?? []
    });
  } catch (error) {
    console.error(error);
    return c.json({ error: '取得に失敗しました' }, 500);
  }
});

/* ======================
   サーバーの起動設定
====================== */
if (process.env.NODE_ENV !== 'production' || !process.env.LAMBDA_TASK_ROOT) {
  const port = 3000;
  console.log(`🚀 Server is running on http://localhost:${port}`);
  serve({ fetch: app.fetch, port, hostname: '0.0.0.0' });
}

export const handler = handle(app);
export default app;
