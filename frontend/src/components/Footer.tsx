import { FaTwitter, FaInstagram, FaFacebook, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 w-full border-t border-gray-600">

      <div className="container mx-auto px-4 flex flex-col items-center gap-8">

        {/* Brand Section */}
      <div className="text-center">
          <h2 className="text-4xl font-extrabold tracking-[0.25em] text-white">
           PHANTOM TROOP
          </h2>

      <div className="w-24 h-[2px] bg-gray-400 mx-auto mt-3"></div>

        {/* アプリ名 */}
      <p className="text-gray-300 text-sm mt-3 tracking-wide">
           SUKI MAP
      </p>
      </div>

        {/* Main Footer Content */}
        <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-6 md:gap-0">

          {/* 1. Copyright */}
          <div className="order-2 md:order-1 text-center md:text-left">
            <p className="text-sm font-medium">
              &copy; 2026 Your Company. <span className="block md:inline">All rights reserved.</span>
            </p>
          </div>

          {/* 2. Social Icons */}
          <div className="order-1 md:order-2 flex justify-center gap-8 md:gap-6">
            <a href="#" className="text-gray-600 hover:text-sky-500 transition-colors p-1" aria-label="Twitter">
              <FaTwitter size={24} />
            </a>
            <a href="#" className="text-gray-600 hover:text-pink-500 transition-colors p-1" aria-label="Instagram">
              <FaInstagram size={24} />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-700 transition-colors p-1" aria-label="Facebook">
              <FaFacebook size={24} />
            </a>
            <a href="#" className="text-gray-600 hover:text-white transition-colors p-1" aria-label="Github">
              <FaGithub size={24} />
            </a>
          </div>

          {/* 3. Footer Links */}
          <div className="order-3 flex flex-wrap justify-center md:justify-end text-sm gap-4">
            <a href="/news" className="text-gray-400 hover:underline">News</a>
            <a href="/contact" className="text-gray-400 hover:underline">Contact Us</a>
            <a href="/privacy" className="text-gray-400 hover:underline">Privacy Policy</a>
            <a href="/terms" className="text-gray-400 hover:underline">Terms of Service</a>
            <p className="text-gray-400 text-sm">Operated by: Phantom Troop</p>
          </div>

        </div>
      </div>
    </footer>
  );
}