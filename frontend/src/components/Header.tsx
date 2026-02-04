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
<header className="bg-gradient-to-r from-gray-900 via-emerald-950 to-gray-900">
  <nav
    aria-label="Global"
    className="flex w-full items-center justify-between px-3 py-4 lg:px-6"
  >
    {/* Left: Brand (icon + name) */}
    <div className="flex items-center">
  <a href="#" className="flex items-center gap-3">

    <img
      alt="SUKI"
      src="app-icons.png"
      className="h-12 w-10 object-contain drop-shadow-sm"
    />

    <span className="text-2xl font-semibold tracking-wide text-white translate-y-[1px]">
  <span className="text-emerald-300">SU</span>KI
</span>

  </a>
</div>


    {/* Desktop nav */}
    <PopoverGroup className="hidden lg:flex items-center gap-x-8">
      <Popover className="relative">
        <PopoverButton className="flex items-center gap-x-1 text-sm font-semibold text-white/90 hover:text-white">
          Product
          <ChevronDownIcon aria-hidden="true" className="size-5 flex-none text-white/60" />
        </PopoverButton>

        {/* ... PopoverPanel 以下はそのままでOK */}
      </Popover>

      <a href="#" className="text-sm font-semibold text-white/90 hover:text-white">Features</a>
      <a href="#" className="text-sm font-semibold text-white/90 hover:text-white">Marketplace</a>
      <a href="#" className="text-sm font-semibold text-white/90 hover:text-white">Company</a>
    </PopoverGroup>

    {/* Mobile button */}
    <div className="flex lg:hidden">
      <button
        type="button"
        onClick={() => setMobileMenuOpen(true)}
        className="inline-flex items-center justify-center rounded-md p-2 text-white/70 hover:text-white hover:bg-white/10"
      >
        <span className="sr-only">Open main menu</span>
        <Bars3Icon aria-hidden="true" className="size-7" />
      </button>
    </div>
  </nav>


      {/* Mobile menu dialog */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-100/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <div className="flex items-center space-x-2">
                <img
                  alt="SUKI"
                  src="app-icons.png"
                  className="h-12 w-12 object-contain"
                />
                <span className="text-2xl font-semibold tracking-wide text-white">
                  <span className="text-emerald-300">SU</span>KI
                </span>

              </div>
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-gray-400"
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
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-white/5"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-white/5"
                >
                  Marketplace
                </a>
                <a
                  href="#"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-white/5"
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
