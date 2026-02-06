export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-20 w-full border-t border-gray-600">

      <div className="container mx-auto px-4 flex flex-col items-center gap-8">

        {/* Brand Section */}
        <div className="text-center">
          <h2 className="text-5xl font-extrabold tracking-[0.28em] text-white">
            PHANTOM TROOP
          </h2>

          <div className="w-36 h-[2px] bg-gray-300 mx-auto mt-4 rounded-full"></div>

          {/* アプリ名 */}
          <p className="text-gray-300 text-base mt-5 tracking-widest">
            SUKI MAP
          </p>
        </div>

      </div>
    </footer>
  );
}