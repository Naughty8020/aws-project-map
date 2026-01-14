// backend/src/index.ts
import { handle } from 'hono/aws-lambda'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import {BedrockRuntimeClient,InvokeModelCommand} from '@aws-sdk/client-bedrock-runtime'

const app = new Hono()
const bedrock = new BedrockRuntimeClient({region: 'ap-northeast-1'})
// フロントエンドからのアクセスを許可
app.use('/api/*', cors())

app.get('/api/ai',async (c) => {
  const prompt = "清水寺の1月中旬の混雑度（1-10）を予測し、数字1文字のみ出力せよ。解説は厳禁とする。";
  const command = new InvokeModelCommand({
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    contentType:"application/json",
    accept:"application/json",
    // backend/src/index.ts の body 部分
    body: JSON.stringify({
      anthropic_version: "bedrock-2023-05-31", // これが必須です
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: prompt }], // content は配列にするのが確実
        },
      ],
    }),
  });

  try {
    const response = await bedrock.send(command);
    const result = JSON.parse(new TextDecoder().decode(response.body));
    const text = result.content[0].text;

    return c.json({ answer: text });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Bedrock呼び出しに失敗しました" }, 500);
  }
});

export const handler = handle(app)
export type AppType = typeof app
