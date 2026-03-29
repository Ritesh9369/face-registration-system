import React from "react";

function Register() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-3xl font-bold mb-6">📝 Register Face</h1>

      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-[350px]">
        <input
          type="text"
          placeholder="Enter Name"
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white outline-none"
        />

        <div className="w-full h-[200px] bg-gray-700 rounded mb-4 flex items-center justify-center">
          Camera Area
        </div>

        <button className="w-full bg-green-500 hover:bg-green-600 py-2 rounded-lg">
          Capture & Register
        </button>
      </div>
    </div>
  );
}

export default Register;
