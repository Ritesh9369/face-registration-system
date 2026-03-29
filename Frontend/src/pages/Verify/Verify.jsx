import React from "react";

function Verify() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-6">✅ Verify Face</h1>

      <div className="w-[400px] h-[300px] bg-gray-800 rounded-xl flex items-center justify-center shadow-lg border border-gray-700">
        <p className="text-gray-400">Camera Preview</p>
      </div>

      <button className="mt-6 bg-purple-500 hover:bg-purple-600 px-6 py-2 rounded-lg transition">
        Verify Now
      </button>
    </div>
  );
}

export default Verify;
