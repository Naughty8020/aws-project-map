import React from 'react';
import { useKyotoEvents } from '../api/event.ts';
import type { KyotoEvent } from '../types/event';

const EventBoard: React.FC = () => {
  const { data: events = [], isLoading, isError, error } = useKyotoEvents();

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <span className="ml-3 text-gray-600">京都のイベントを取得中...</span>
      </div>
    );

  if (isError)
    return (
      <div className="text-red-500 text-center py-10">
        イベントの取得に失敗しました: {(error as Error).message}
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 border-l-4 border-red-500 pl-4">
        京都の最新イベント
      </h2>

      {events.length === 0 ? (
        <p className="text-gray-500">現在表示できるイベントはありません。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event: KyotoEvent) => (
            <div
              key={event.eventId}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="text-lg font-bold mb-2">{event.eventName}</h3>
              <p className="text-sm text-gray-600 mb-1">📅 {event.eventDate}</p>
              <p className="text-sm text-gray-600 mb-1">📍 {event.city}</p>
              <p className="text-sm text-gray-600 mb-2">📝 {event.detail}</p>

              {event.link && (
                <a
                  href={event.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full text-center py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                >
                  公式サイトで確認
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventBoard;

