import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen' // 自動生成されるファイル
import './tailwind.css'

const queryClient = new QueryClient()
const router = createRouter({ routeTree })

// 3. 型安全のための宣言（Linkコンポーネントの補完が効くようになる）
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* 4. <App /> ではなく <RouterProvider /> を使う */}
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)
