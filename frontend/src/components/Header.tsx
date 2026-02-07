import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import {
  Dialog,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
  GlobeAltIcon,
} from '@heroicons/react/24/outline'

const translations = {
  ja: {
    weather: '天気',
    event: 'イベント',
    company: '会社',
  },
  en: {
    weather: 'Weather',
    event: 'Event',
    company: 'Company',
  },
} as const

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [language, setLanguage] = useState<'ja' | 'en'>('ja')

  return (
    <header className="relative bg-[url('../../public/1091814.jpg')] h-25 bg-cover bg-[center_bottom_15%]">
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      {/* ================= NAV ================= */}
      <nav className="relative z-10 flex w-full items-center justify-between px-5 py-4 lg:px-6">
        {/* Brand */}
        <div className="flex items-center pl-3">
          <Link to="/" className="flex items-center gap-3">
            <img
              alt="SUKI"
              src="app-icons.png"
              className="h-15 w-20 object-contain"
            />
            <span className="text-4xl font-semibold text-gray-200">
              <span className="text-emerald-300">SU</span>KI MAP
            </span>
          </Link>
        </div>

        {/* ===== Right side ===== */}
        <div className="flex items-center gap-1">
          {/* Language */}
          <Popover className="relative">
  {({ close }) => (
    <>
      <PopoverButton className="flex items-center gap-1 rounded-md px-1 py-1 text-white/80 hover:bg-white/10">
        <GlobeAltIcon className="h-8 w-8" />
        <span className="text-sm font-semibold">
          {language === 'ja' ? 'JA' : 'EN'}
        </span>
      </PopoverButton>

      <PopoverPanel className="absolute right-0 mt-2 w-28 rounded-lg bg-gray-900">
        <button
          onClick={() => {
            setLanguage('ja')
            close()
          }}
          className={`block w-full px-4 py-2 text-left text-sm ${
            language === 'ja' ? 'text-emerald-300' : 'text-white'
          } hover:bg-white/10`}
        >
          日本語
        </button>

        <button
          onClick={() => {
            setLanguage('en')
            close() // ← これで閉じる
          }}
          className={`block w-full px-4 py-2 text-left text-sm ${
            language === 'en' ? 'text-emerald-300' : 'text-white'
          } hover:bg-white/10`}
        >
          English
        </button>
      </PopoverPanel>
    </>
  )}
</Popover>

          {/* Mobile button */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="rounded-md p-2 text-white/80 hover:bg-white/10"
          >
            <Bars3Icon className="size-10" />
          </button>
        </div>
      </nav>

      {/* ================= Mobile menu ================= */}
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" />

        <div className="fixed inset-0 flex justify-end">
          <DialogPanel className="relative w-full max-w-sm h-screen bg-gray-900 p-6">
            {/* background */}
            <div className="absolute inset-0 bg-[url('../../public/1091814.jpg')] bg-cover bg-[60%_center]" />
            <div className="absolute inset-0 bg-black/60" />

            {/* content */}
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3"
                >
                  <img src="app-icons.png" className="h-12 w-12" />
                  <span className="text-2xl font-semibold text-white">
                    <span className="text-emerald-300">SU</span>KI MAP
                  </span>
                </Link>

                <button onClick={() => setMobileMenuOpen(false)}>
                  <XMarkIcon className="size-6 text-white" />
                </button>
              </div>

              <div className="mt-6 space-y-2">
                <Link
                  to="/weather"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-white/10"
                >
                  {translations[language].weather}
                </Link>

                <Link
                  to="/event"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-white/10"
                >
                  {translations[language].event}
                </Link>

                {/* company */}
                <Link
                  to="/company"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 hover:bg-white/10"
                >
                  <p className="text-base font-semibold text-white">
                    {translations[language].company}
                  </p>
                </Link>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </header>
  )
}