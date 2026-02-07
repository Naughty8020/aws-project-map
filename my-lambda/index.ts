import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { cors } from 'hono/cors';
import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';

/* ======================
   型定義 (types/spot.ts の内容を統合)
====================== */
export interface Spot {
  name: string;
  lat: number;
  lng: number;
  crowd: number;
  imageUrl: string;
  description: string;
  city?: string;
  updatedAt?: string; // 追加
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface BedrockResponse {
  content?: { text: string }[];
}

/* ======================
   初期設定
====================== */
const app = new Hono();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

const region = 'ap-northeast-1';
const s3Client = new S3Client({ region });
const bedrock = new BedrockRuntimeClient({ region });
const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region }));

const BUCKET_NAME = 'kyoto-tourist-data';
const FILE_KEY = 'spots.json';
const SPOTS_TABLE = 'kyoto_event_a9f3k2';

/* ======================
   API: S3データ + AI解析
====================== */

app.all('*', async (c) => {
  try {
    const getCommand = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: FILE_KEY });
    const s3Res = await s3Client.send(getCommand);
    const s3Body = await s3Res.Body?.transformToString();
    if (!s3Body) throw new Error('S3 content is empty');
    const spots = JSON.parse(s3Body) as Spot[];

    const updatedSpots = await Promise.all(spots.map(async (spot) => {
      const prompt = `${spot.name}の今の混雑度を1-100の数値で予測し、数字のみ出力せよ。解説は厳禁。`;
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
        const aiScore = parseInt(result.content?.[0]?.text.trim().replace(/[^0-9]/g, "") || "0");

        return {
          ...spot,
          crowd: isNaN(aiScore) ? spot.crowd : aiScore,
          updatedAt: new Date().toISOString()
        };
      } catch (e) {
        return spot;
      }
    }));

    await s3Client.send(new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: FILE_KEY,
      Body: JSON.stringify(updatedSpots),
      ContentType: "application/json",
    }));

    return c.json<ApiResponse<Spot[]>>({ success: true, data: updatedSpots });
  } catch (error: any) {
    return c.json({ success: false, data: [], error: error.message }, 500);
  }
});

export const handler = handle(app);
