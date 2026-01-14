import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda' // Lambda用のアダプター

const app = new Hono()

app.get('/api/hello', (c) => {
  return c.json({ message: 'Hello from Hono on Lambda!' })
})

// Lambdaハンドラーとしてエクスポート
export const handler = handle(app)

