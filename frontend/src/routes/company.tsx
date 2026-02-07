import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/company')({
  component: CompanyPage,
})

function CompanyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <h1 className="text-5xl font-extrabold tracking-wider mb-12 pb-4 border-b-4 border-emerald-400">
  Phantom Troop
</h1>

      {/* 会社概要 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 border-l-4 border-emerald-400 pl-3">
          会社概要
        </h2>
        <p className="leading-7 text-base">
          SUKI MAP(運営:Phantom Troop)は、観光地の混雑予測・天気・イベント情報を統合し、
          旅行者が “もっと自由に旅を楽しめる” 未来を目指すテクノロジー企業です。
        </p>
      </section>

      {/* ミッション */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 border-l-4 border-emerald-400 pl-3">
          ミッション
        </h2>
        <p className="leading-7 text-base">
          「旅を、もっと自由に。」
          私たちは、混雑や情報不足によるストレスをなくし、
          旅行者が本当に行きたい場所を、最適なタイミングで楽しめる世界をつくります。
        </p>
      </section>

      {/* 事業内容 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 border-l-4 border-emerald-400 pl-3">
          事業内容
        </h2>
        <ul className="list-disc list-inside leading-7 text-base space-y-1">
          <li>観光混雑予測システムの開発</li>
          <li>天気・イベント情報の統合プラットフォーム</li>
          <li>観光地向けデータ分析支援</li>
          <li>地域活性化のためのデジタルソリューション提供</li>
        </ul>
      </section>

      {/* CEO */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 border-l-4 border-emerald-400 pl-3">
          CEO
        </h2>
        <div className="leading-7 text-base">
          <p className="font-semibold text-lg">田村 優典</p>
          <p className="mt-1">
            観光 × データ × テクノロジーを軸に、旅行者がより快適に旅を楽しめる社会を目指しています。
          </p>
        </div>
      </section>

      {/* メンバー */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3 border-l-4 border-emerald-400 pl-3">
          メンバー
        </h2>

        <ul className="space-y-4 leading-7 text-base">
          <li>
            <p className="font-semibold text-lg">山口 雷太</p>
            <p className="text-sm text-gray-700">フロントエンドエンジニア</p>
          </li>

          <li>
            <p className="font-semibold text-lg">松中 惟歩樹</p>
            <p className="text-sm text-gray-700">バックエンド / インフラ</p>
          </li>

          <li>
            <p className="font-semibold text-lg">千種 瑛大</p>
            <p className="text-sm text-gray-700">データ分析 / モデル開発</p>
          </li>
        </ul>
      </section>

      {/* お問い合わせ */}
      <section>
        <h2 className="text-xl font-semibold mb-3 border-l-4 border-emerald-400 pl-3">
          お問い合わせ
        </h2>
        <p className="leading-7 text-base mb-1">
          ご質問・ご相談は以下よりお気軽にご連絡ください。
        </p>
        <ul className="leading-7 text-base space-y-1">
          <li>Email: KTC@PhantomTroop.com</li>
        </ul>
      </section>
    </div>
  )
}