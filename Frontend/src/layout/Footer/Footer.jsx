import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700 py-4 px-6 flex flex-col md:flex-row justify-between items-center">
      <h2 className="text-white font-semibold">🚀 Face Recognition</h2>

      <p className="text-gray-400 text-sm">
        © {new Date().getFullYear()} All rights reserved
      </p>

      <div className="flex gap-4 mt-2 md:mt-0">
        <a href="#" className="hover:text-white">
          Privacy
        </a>
        <a href="#" className="hover:text-white">
          Terms
        </a>
        <a href="#" className="hover:text-white">
          Contact
        </a>
      </div>
    </footer>
  );
}

export default Footer;
