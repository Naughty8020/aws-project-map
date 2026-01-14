// backend/src/index.ts
import { handle } from 'hono/aws-lambda'
import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

// フロントエンドからのアクセスを許可
app.use('/api/*', cors())

app.get('/api/data', (c) => {
  return c.json({ message: 'Hello from Lambda!' })
})

export const handler = handle(app)
export type AppType = typeof app
