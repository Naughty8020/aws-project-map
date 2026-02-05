import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import type { Spot } from '../types/spot'
import WeatherData from './WeatherComponents'
import { distanceMeters } from "../utils/distance";

type Props = {
  spot: Spot | null
  myPos?: { lat: number; lng: number } | null
  onClose: () => void
}

function crowdLabel(crowd: number) {
  if (crowd < 10) return { text: 'ガラガラ', color: 'bg-green-500' }
  if (crowd < 30) return { text: '空いている', color: 'bg-lime-500' }
  if (crowd < 50) return { text: 'ふつう', color: 'bg-yellow-500' }
  if (crowd < 70) return { text: '混雑', color: 'bg-orange-500' }
  return { text: '満員', color: 'bg-red-500' }
}

export default function SpotDetailModal({ spot, myPos, onClose }: Props) {
  if (!spot) return null

  const badge = crowdLabel(spot.crowd)

  // ✅ 距離計算
  const distance =
    myPos ? distanceMeters(myPos, { lat: spot.lat, lng: spot.lng }) : null

  const distanceText = distance
    ? distance < 1000
      ? `現在地から 約${Math.round(distance)}m`
      : `現在地から ${(distance / 1000).toFixed(1)}km`
    : null

    const walkMinutes = distance ? Math.round(distance / 80) : null // 徒歩 約80m/分
    const carMinutes = distance ? Math.round(distance / 500) : null      // 車
    const trainMinutes = distance ? Math.round(distance / 670) : null    // 電車

  return (
    <Transition appear show={!!spot} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* 背景暗転 */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-3 sm:p-6">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-6"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-6"
          >
            <Dialog.Panel className="relative w-full max-w-2xl h-[70vh] sm:h-[65vh] rounded-2xl overflow-hidden shadow-2xl">

              {/* 背景画像 */}
              {spot.imageUrl ? (
                <img
                  src={spot.imageUrl}
                  alt={spot.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 bg-gray-800" />
              )}

              {/* グラデーション */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {/* ❌ 閉じるボタン */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 w-11 h-11 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 backdrop-blur text-white text-xl transition"
              >
                ✕
              </button>

              {/* 左上情報 */}
              <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
                <WeatherData selectedSpot={spot} spots={[]} />
                <span className={`rounded-full px-3 py-1 text-sm font-bold text-white shadow ${badge.color}`}>
                  {badge.text}
                </span>
              </div>

              {/* 下部コンテンツ */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 text-white">

                <h2 className="text-3xl sm:text-4xl font-bold drop-shadow-xl mb-2">
                  {spot.name}
                </h2>

                {/* 距離表示 */}
                {distance && (
                    <div className="text-sm text-gray-200 mb-2 drop-shadow">
                        📍 現在地から {distance < 1000
                        ? `約${Math.round(distance)}m`
                        : `約${(distance / 1000).toFixed(1)}km`}

                        {walkMinutes && walkMinutes < 30 ? (
                        <> ・🚶 徒歩 約{walkMinutes}分</>
                        ) : (
                        <>
                            {trainMinutes && <> ・🚃 電車 約{trainMinutes}分</>}
                            {carMinutes && <> ・🚗 車 約{carMinutes}分</>}
                        </>
                        )}
                    </div>
                    )}

                {/* 混雑度バー */}
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-sm text-gray-200">混雑度</span>
                  <span className="text-xl font-bold">{spot.crowd}%</span>
                </div>

                <div className="w-48 h-2 bg-white/20 rounded-full overflow-hidden my-3">
                  <div
                    className={`h-full ${badge.color}`}
                    style={{ width: `${spot.crowd}%` }}
                  />
                </div>

                {/* 説明文スクロール */}
                {spot.description && (
                  <div className="max-h-32 overflow-y-auto pr-2 text-gray-100 text-sm leading-relaxed drop-shadow">
                    {spot.description}
                  </div>
                )}
              </div>

            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}
