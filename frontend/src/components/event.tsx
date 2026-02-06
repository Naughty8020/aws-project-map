import React, { useEffect, useState } from 'react';
import { getKyotoEvents } from '../api/event.ts';
import type { KyotoEvent } from '../types/event';

const EventBoard: React.FC = () => {
  const [events, setEvents] = useState<KyotoEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getKyotoEvents();
      setEvents(data);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <span className="ml-3 text-gray-600">京都のイベントを取得中...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 border-l-4 border-red-500 pl-4">
        京都の最新イベント
      </h2>

      {events.length === 0 ? (
        <p className="text-gray-500">現在表示できるイベントはありません。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, index) => (
            <article
              key={index}
              className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              {/* 画像エリア */}
              <div className="relative h-48 overflow-hidden bg-gray-200">
                {event.image ? (
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                )}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-red-600">
                  {event.category}
                </div>
              </div>

              {/* コンテンツエリア */}
              <div className="p-4">
                <h3 className="text-lg font-bold line-clamp-2 mb-2 group-hover:text-blue-600">
                  {event.title}
                </h3>

                <div className="space-y-1 text-sm text-gray-600">
                  <p className="flex items-center">
                    <span className="mr-2">📅</span> {event.period}
                  </p>
                  <p className="flex items-center">
                    <span className="mr-2">📍</span> {event.location}
                  </p>
                </div>

                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 block w-full text-center py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  公式サイトで確認
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventBoard;
