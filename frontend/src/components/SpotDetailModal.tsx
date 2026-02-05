import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import type { Spot } from '../types/spot'
import WeatherData from './WeatherComponents'

type Props = {
    spot: Spot | null
    onClose: () => void
}

function crowdLabel(crowd: number) {
    if (crowd < 10) return { text: 'ガラガラ', color: 'bg-green-500' }
    if (crowd < 30) return { text: '空いている', color: 'bg-lime-500' }
    if (crowd < 50) return { text: 'ふつう', color: 'bg-yellow-500' }
    if (crowd < 70) return { text: '混雑', color: 'bg-orange-500' }
    return { text: '満員', color: 'bg-red-500' }
}

export default function SpotDetailModal({ spot, onClose }: Props) {
    if (!spot) return null

    const badge = crowdLabel(spot.crowd)

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

        <div className="fixed inset-0 flex items-center justify-center p-4">
            <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95 translate-y-6"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-95 translate-y-6"
            >
            <Dialog.Panel className="relative w-full max-w-2xl h-[65vh] rounded-2xl overflow-hidden shadow-2xl">

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

              {/* グラデーション（上は透明 → 下に行くほど濃く） */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

              {/* ❌ 閉じるボタン */}
                <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-white text-xl"
                >
                ✕
                </button>

              {/* ⭐ 左上：天気＋混雑ラベル */}
                <div className="absolute top-4 left-4 z-50 flex items-center gap-2">
                <WeatherData selectedSpot={spot} spots={[]} />
                <span
                    className={`backdrop-blur-md rounded-2xl px-3 py-1 text-sm font-bold text-white shadow-lg ${badge.color}`}
                >
                    {badge.text}
                </span>
                </div>

              {/* 下部コンテンツ */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end text-white overflow-y-auto">

                {/* タイトル */}
                <h2 className="text-4xl font-bold drop-shadow-xl mb-3">
                    {spot.name}
                </h2>

                {/* 混雑度 */}
                <div className="flex items-center gap-3 mb-2">
                    <span className="text-gray-200 text-sm">混雑度</span>
                    <span className="text-2xl font-bold">{spot.crowd}%</span>
                </div>

                <div className="w-56 h-2 bg-white/20 rounded-full overflow-hidden mb-6">
                    <div
                    className={`h-full transition-all duration-700 ease-out ${badge.color}`}
                    style={{ width: `${spot.crowd}%` }}
                    />
                </div>

                {/* 説明文 */}
                {spot.description && (
                    <p className="max-w-2xl text-gray-100 leading-relaxed whitespace-pre-line drop-shadow-lg">
                    {spot.description}
                    </p>
                )}
                </div>

            </Dialog.Panel>
            </Transition.Child>
        </div>
        </Dialog>
    </Transition>
    )
}
