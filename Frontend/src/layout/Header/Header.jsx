import React from "react";
import { Bell, User } from "lucide-react";

function Header() {
  return (
    <div className="w-full h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6 shadow-md">
      {/* Left Side */}
      <h1 className="text-lg font-semibold text-white">Dashboard</h1>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notification */}
        <button className="relative p-2 rounded-full hover:bg-gray-700 transition">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-700 px-3 py-1 rounded-lg transition">
          <User size={20} />
          <span className="text-sm">Ritesh</span>
        </div>
      </div>
    </div>
  );
}

export default Header;
