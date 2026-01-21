
import { useCrowdData } from './hooks/useCrowdData';
import { hc } from 'hono/client';
import type { AppType } from '../../backend/src/index'; // バックエンドの型を読み込む
import Header from '../src/components/Header.tsx';
import GoogleMap from './components/MapComponents';
import Apexcarts from '../src/components/CrowdGraph.tsx';
// SSTが発行したURLをここに貼る
export const client = hc<AppType>('https://kezxwvevrxzfot4frmpdqhsegu0bjjyt.lambda-url.ap-northeast-1.on.aws')

function App() {
  const { data, isLoading, error } = useCrowdData();

  if (isLoading) return <div>読み込み中...</div>;
  if (error)return <div>エラーが発生しました</div>;

  return (
    <div>
      <Header />
      <GoogleMap />
      <Apexcarts />
      <h1>Hono + TanStack Query</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
export default App
