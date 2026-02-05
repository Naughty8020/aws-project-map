import React from "react";

type Props = {
  onLocate: () => void;
  locating: boolean;
  enabled: boolean;

  onZoomIn: () => void;
  onZoomOut: () => void;
};

export default function CurrentLocationControl({
  onLocate,
  locating,
  enabled,
  onZoomIn,
  onZoomOut,
}: Props) {
  return (
    <div className="absolute right-3 bottom-3 z-10 flex flex-col gap-2">
      <button
        type="button"
        onClick={onLocate}
        disabled={!enabled || locating}
        className="rounded-full border bg-white shadow-md px-4 py-3 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="現在地を表示"
      >
        {locating ? "取得中..." : "📍 現在地"}
      </button>

      <div className="rounded-xl overflow-hidden border bg-white shadow-md">
        <button
          type="button"
          onClick={onZoomIn}
          className="w-12 h-10 flex items-center justify-center hover:bg-gray-50"
          aria-label="ズームイン"
        >
          ＋
        </button>
        <div className="h-px bg-gray-200" />
        <button
          type="button"
          onClick={onZoomOut}
          className="w-12 h-10 flex items-center justify-center hover:bg-gray-50"
          aria-label="ズームアウト"
        >
          －
        </button>
      </div>
    </div>
  );
}
