import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  Camera,
  LogIn,
  Menu,
  UserPlus,
  ShieldCheck,
  ScanFace
} from "lucide-react";

function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <div
      className={`h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-lg transition-all duration-300 ${
        open ? "w-64" : "w-20"
      } relative`}
    >
      {/* Top */}
      <div className="flex items-center justify-between p-4">
        <h2 className={`text-xl font-bold ${!open && "hidden"}`}>🚀 Face AI</h2>

        <Menu className="cursor-pointer" onClick={() => setOpen(!open)} />
      </div>

      {/* Menu */}
      <nav className="mt-6 space-y-2 px-2">
       
        {/* Live Verify */}
        <NavLink
          to="/live"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg ${
              isActive ? "bg-blue-500" : "hover:bg-gray-700"
            }`
          }
        >
          <ScanFace size={20} />
          <span className={`${!open && "hidden"}`}>Live Verify</span>
        </NavLink>

        {/* Register */}
        <NavLink
          to="/register"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg ${
              isActive ? "bg-blue-500" : "hover:bg-gray-700"
            }`
          }
        >
          <UserPlus size={20} />
          <span className={`${!open && "hidden"}`}>Register</span>
        </NavLink>

        {/* Verify */}
        <NavLink
          to="/verify"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-lg ${
              isActive ? "bg-blue-500" : "hover:bg-gray-700"
            }`
          }
        >
          <ShieldCheck size={20} />
          <span className={`${!open && "hidden"}`}>Verify</span>
        </NavLink>

        {/* Camera */}
        

        
      </nav>

      {/* Bottom */}
      <div className="absolute bottom-5 left-4 text-sm text-gray-400">
        {open ? "⚡ Powered by AI" : "⚡"}
      </div>
    </div>
  );
}

export default Sidebar;
