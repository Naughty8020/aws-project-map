import { useState } from 'react';
import {
  Dialog,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
} from '@headlessui/react';
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative bg-[url('../../public/1091814.jpg')] h-25 bg-cover bg-[center_bottom_15%]">      {/* background dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <nav
        aria-label="Global"
        className="relative z-10 flex w-full items-center justify-between px-5 py-4 lg:px-6"
      >
        {/* Left: Brand */}
        <div className="flex items-center pl-3">
          <a href="#" className="flex items-center gap-3">
            <img
              alt="SUKI"
              src="app-icons.png"
              className="h-15 w-20 object-contain drop-shadow-sm"
            />
            <span className="text-4xl font-semibold tracking-wide text-gray-200 translate-y-[1px]">
              <span className="text-emerald-300">SU</span>KI MAP
            </span>
          </a>
        </div>

        {/* Desktop nav */}
        <PopoverGroup className="hidden hidden items-center gap-x-8">
          <Popover className="relative">
            <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold text-white hover:text-emerald-300">
              Product
              <ChevronDownIcon
                aria-hidden="true"
                className="size-5 flex-none text-white/70"
              />
            </PopoverButton>
            {/* PopoverPanel は省略（そのままでOK） */}
          </Popover>

          <a href="#" className="text-sm font-semibold text-white hover:text-emerald-300">
            Features
          </a>
          <a href="#" className="text-sm font-semibold text-white hover:text-emerald-300">
            Marketplace
          </a>
          <a href="#" className="text-sm font-semibold text-white hover:text-emerald-300">
            Company
          </a>
        </PopoverGroup>

        {/* Mobile button */}
        <div className="flex pr-3">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex items-center justify-center rounded-md p-2  text-white/80 hover:text-white hover:bg-white/10"
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon aria-hidden="true" className="size-10" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <DialogPanel
          className="bg-[url('../../public/1091814.jpg')] bg-[position:60%_center] bg-cover fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-100 p-6 sm:max-w-sm sm:ring-1 sm:ring-white/10"
        >
          <div className="absolute inset-0 bg-black/60" />

          <div className="flex items-center  justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <div className="flex items-center space-x-2">
                <img
                  alt="SUKI"
                  src="app-icons.png"
                  className="h-12 w-12 object-contain z-50"
                />
                <span className="text-2xl z-50 font-semibold tracking-wide text-white">
                  <span className="text-emerald-300 ">SU</span>KI MAP
                </span>
              </div>
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 z-50 text-gray-400 hover:text-white"
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon aria-hidden="true" className="size-6" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-white/10">
              <div className="space-y-2 py-6">
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-white/10"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-white/10"
                >
                  Marketplace
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-white/10"
                >
                  Company
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}

