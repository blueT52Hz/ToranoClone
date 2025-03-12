import { Bell, ChevronDown, Search } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="flex items-center justify-between h-16 p-2 bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="flex-1 max-w-md">
        {/* <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="search"
            placeholder="Tìm kiếm..."
            className="w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
          />
        </div> */}
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-600 hover:text-blue-600 focus:outline-none">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="relative">
          <button
            className="flex items-center text-sm font-medium text-gray-700 focus:outline-none"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="w-8 h-8 mr-2 rounded-full bg-blue-600 flex items-center justify-center text-white">
              A
            </div>
            <span>Admin</span>
            <ChevronDown className="ml-1 h-4 w-4" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Hồ sơ của bạn
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Cài đặt
              </a>
              <hr className="my-1" />
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Đăng xuất
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
