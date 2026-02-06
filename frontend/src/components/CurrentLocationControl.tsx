import React from "react";

type Props = {
  onLocate: () => void;
  locating: boolean;
  enabled: boolean;

  onZoomIn: () => void;
  onZoomOut: () => void;
};

function Tooltip({
  children,
  showOnMobile = false,
}: {
  children: React.ReactNode;
  showOnMobile?: boolean;
}) {
  return (
    <span
      className={[
        "pointer-events-none absolute right-full mr-2 top-1/2 -translate-y-1/2",
        "whitespace-nowrap rounded-md px-2 py-1 text-xs text-gray-800",
        "bg-white shadow-lg shadow-black/10 ring-1 ring-black/10",
        "opacity-0 translate-x-1",
        "group-hover:opacity-100 group-hover:translate-x-0",
        "transition",
        // 吹き出しの三角（右向き）
        "before:content-[''] before:absolute before:left-full before:top-1/2 before:-translate-y-1/2",
        "before:border-y-[6px] before:border-y-transparent before:border-l-[6px] before:border-l-white",
        // 三角の枠線っぽい縁（うっすら）
        "after:content-[''] after:absolute after:left-full after:top-1/2 after:-translate-y-1/2 after:ml-[1px]",
        "after:border-y-[6px] after:border-y-transparent after:border-l-[6px] after:border-l-black/10",
        showOnMobile ? "" : "hidden md:inline-flex",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

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
      {/* 現在地 */}
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
          "text-gray-700",
          "transition",
          "hover:bg-gray-100 hover:text-gray-900",
          "active:bg-gray-200 active:scale-95",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100",
        ].join(" ")}
      >
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

        <Tooltip>{locating ? "取得中…" : "現在地を表示"}</Tooltip>
      </button>

      {/* ズーム */}
      {/* ズーム：外側は overflow-visible にして吹き出しを逃がす */}
      <div className="relative overflow-visible">
        {/* 角丸・枠・背景・影は内側で保持（ここだけ overflow-hidden） */}
        <div className="overflow-hidden rounded-2xl bg-white/90 backdrop-blur shadow-lg shadow-black/10 ring-1 ring-black/10">
          <button
            type="button"
            onClick={onZoomIn}
            aria-label="ズームイン"
            className={[
              "group relative grid place-items-center",
              "h-10 w-11",
              "text-lg font-medium text-gray-700",
              "transition",
              "hover:bg-gray-100 hover:text-gray-900",
              "active:bg-gray-200 active:scale-95",
            ].join(" ")}
          >
            ＋
            <Tooltip>ズームイン</Tooltip>
          </button>

          <div className="h-px bg-black/10" />

          <button
            type="button"
            onClick={onZoomOut}
            aria-label="ズームアウト"
            className={[
              "group relative grid place-items-center",
              "h-10 w-11",
              "text-lg font-medium text-gray-700",
              "transition",
              "hover:bg-gray-100 hover:text-gray-900",
              "active:bg-gray-200 active:scale-95",
            ].join(" ")}
          >
            －
            <Tooltip>ズームアウト</Tooltip>
          </button>
        </div>
      </div>

    </div>
  );
}
