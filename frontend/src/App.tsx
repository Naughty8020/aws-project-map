
import { useQuery } from '@tanstack/react-query';
import { hc } from 'hono/client';
import type { AppType } from '../../backend/src/index'; // バックエンドの型を読み込む

// SSTが発行したURLをここに貼る
export const client = hc<AppType>('https://kezxwvevrxzfot4frmpdqhsegu0bjjyt.lambda-url.ap-northeast-1.on.aws')

function App() {
  const { data, isLoading } = useQuery({
    queryKey: ['hello'],
    queryFn: async () => {
      const res = await client.api.data.$get();
      return await res.json();
    },
  });

  if (isLoading) return <div>読み込み中...</div>;

  return (
    <div>
      <h1>Hono + TanStack Query</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
export default App
