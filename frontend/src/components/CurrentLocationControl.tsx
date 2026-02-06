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
  const locateDisabled = !enabled || locating;

  return (
    <div className="absolute right-3 bottom-[21px] z-10 flex flex-col items-end gap-2">
      {/* 現在地：丸いFAB */}
      <button
        type="button"
        onClick={onLocate}
        disabled={locateDisabled}
        aria-label="現在地を表示"
        className={[
          "group relative grid place-items-center",
          "h-11 w-11 rounded-full",
          "bg-white/90 backdrop-blur",
          "shadow-lg shadow-black/10 ring-1 ring-black/10",
          "active:scale-[0.98] transition",
          "hover:bg-white",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        ].join(" ")}
      >
        {/* 取得中の簡易スピナー */}
        {locating ? (
          <span
            className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-gray-700 animate-spin"
            aria-hidden
          />
        ) : (
          <span className="text-lg leading-none" aria-hidden>
            📍
          </span>
        )}

        {/* ホバー時ラベル（PCで便利） */}
        <span
          className={[
            "pointer-events-none absolute right-full mr-2",
            "rounded-md bg-black/80 px-2 py-1 text-xs text-white",
            "opacity-0 translate-x-1",
            "group-hover:opacity-100 group-hover:translate-x-0",
            "transition hidden md:block",
          ].join(" ")}
        >
          {locating ? "取得中…" : "現在地"}
        </span>
      </button>

      {/* ズーム：縦カード */}
      <div className="overflow-hidden rounded-2xl bg-white/90 backdrop-blur shadow-lg shadow-black/10 ring-1 ring-black/10">
        <button
          type="button"
          onClick={onZoomIn}
          aria-label="ズームイン"
          className={[
            "grid place-items-center",
            "h-10 w-11",
            "text-lg font-medium text-gray-800",
            "hover:bg-gray-50/80 active:bg-gray-100/80",
            "transition",
          ].join(" ")}
        >
          ＋
        </button>
        <div className="h-px bg-black/10" />
        <button
          type="button"
          onClick={onZoomOut}
          aria-label="ズームアウト"
          className={[
            "grid place-items-center",
            "h-10 w-11",
            "text-lg font-medium text-gray-800",
            "hover:bg-gray-50/80 active:bg-gray-100/80",
            "transition",
          ].join(" ")}
        >
          －
        </button>
      </div>
    </div>
  );
}
