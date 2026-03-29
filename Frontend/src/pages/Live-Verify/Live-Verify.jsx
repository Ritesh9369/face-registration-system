import React from "react";

function LiveVerify() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-6">🎥 Live Face Verification</h1>

      {/* Camera Box */}
      <div className="w-[400px] h-[300px] bg-gray-800 rounded-xl flex items-center justify-center shadow-lg border border-gray-700">
        <p className="text-gray-400">Camera Preview</p>
      </div>

      {/* Button */}
      <button className="mt-6 bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg transition">
        Start Verification
      </button>
    </div>
  );
}

export default LiveVerify;
