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
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"; // インポートを追加
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
const s3Client = new S3Client({ region: "ap-northeast-1" });
const BUCKET_NAME = 'kyoto-tourist-data';
const FILE_KEY = 'spots.json';

app.post('/api/sync-spots', async (c) => {
  try {
    // 1. S3から現在のデータを取得
    const s3Res = await fetch(`https://${BUCKET_NAME}.s3.ap-northeast-1.amazonaws.com/${FILE_KEY}`);
    if (!s3Res.ok) throw new Error('S3 fetch failed');
    const spots = (await s3Res.json()) as Spot[];

    // 2. AI (Bedrock) で各スポットの混雑度を更新
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

        // データを更新（更新日時も追加しておくと便利です）
        const newSpot = {
          ...spot,
          crowd: isNaN(aiScore) ? spot.crowd : aiScore,
          updatedAt: new Date().toISOString()
        };

        console.log(`Updated ${spot.name}: ${spot.crowd} -> ${newSpot.crowd}`);
        return newSpot;
      } catch (e) {
        console.error(`AI Score error for ${spot.name}:`, e);
        return spot; // エラー時は元のデータを返す
      }
    }));

    // ★★★ 3. 更新したデータをS3に保存（上書き） ★★★
    try {
      console.log("Saving to S3...");
      const putCommand = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: FILE_KEY,
        Body: JSON.stringify(updatedSpots), // 配列をJSON文字列に変換
        ContentType: "application/json",   // ブラウザ等で見やすくするため
      });

      await s3Client.send(putCommand);
      console.log("S3 Update Successful!");
    } catch (s3Err) {
      console.error("Failed to upload to S3:", s3Err);
      // S3保存に失敗しても、一応計算したデータはフロントに返す
    }

    // 4. クライアントに最新データを返却
    return c.json<ApiResponse<Spot[]>>({ success: true, data: updatedSpots });

  } catch (error) {
    console.error("Sync process failed:", error);
    return c.json<ApiResponse<never>>({
      success: false,
      data: [] as never,
      error: 'Sync failed'
    }, 500);
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
