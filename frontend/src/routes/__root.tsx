import { createRootRoute, Outlet } from '@tanstack/react-router'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const Route = createRootRoute({
  component: () => (
    // 1. flex flex-col を追加して縦並びのレイアウトにする
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* 2. flex-1 を追加して、メインコンテンツが余ったスペースを全て埋めるようにする */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  ),
})
