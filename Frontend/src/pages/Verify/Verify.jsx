import { useState, useRef, useCallback } from "react";
import Webcam from "react-webcam";
import Swal from "sweetalert2";
import { verifyUser } from "../../service/verify/verify";

export default function Verify() {
  const webcamRef = useRef(null);
  const [mode, setMode] = useState("camera");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // ✅ Camera Capture
  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setResult(null);
  }, []);

  // ✅ File Upload
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  // ✅ Mode Switch
  const switchMode = (newMode) => {
    setMode(newMode);
    setImage(null);
    setResult(null);
  };

  // ✅ Verify
  const handleVerify = async () => {
    if (!image) {
      Swal.fire("Error!", "Please capture or upload a photo!", "error");
      return;
    }
    setLoading(true);
    const data = await verifyUser(image);
    setLoading(false);

    if (data.error) {
      Swal.fire("Error!", data.error, "error");
      return;
    }

    setResult(data);

    if (data.verified) {
      Swal.fire({
        icon: "success",
        title: `Welcome ${data.name}! ✅`,
        html: `<p><b>Role:</b> ${data.role}</p><p><b>Match:</b> ${data.similarity}%</p>`,
        confirmButtonColor: "#16a34a"
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Not Recognized! ❌",
        text: "Face not found in database!",
        confirmButtonColor: "#dc2626"
      });
    }
  };

  return (
    <div className="h-screen w-full bg-gray-950 flex overflow-hidden p-4 gap-4">
      {/* LEFT — Camera/Upload */}
      <div className="flex-1 bg-gray-900 rounded-2xl border border-gray-800 flex flex-col p-5">
        {/* Header */}
        <h1 className="text-xl font-bold text-white mb-1">✅ Verify Face</h1>
        <p className="text-gray-400 text-xs mb-3">
          Camera se ya photo upload karke verify karo
        </p>

        {/* Mode Toggle */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => switchMode("camera")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${
              mode === "camera"
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-gray-800 border-gray-700 text-gray-300"
            }`}
          >
            📷 Camera
          </button>
          <button
            onClick={() => switchMode("upload")}
            className={`flex-1 py-2 rounded-xl text-sm font-medium border transition ${
              mode === "upload"
                ? "bg-purple-600 border-purple-600 text-white"
                : "bg-gray-800 border-gray-700 text-gray-300"
            }`}
          >
            📁 Upload Photo
          </button>
        </div>

        {/* ✅ CAMERA MODE */}
        {mode === "camera" && (
          <div className="flex flex-col flex-1 gap-3">
            {/* Camera + Preview side by side */}
            <div className="flex gap-3 flex-1">
              {/* Camera Live */}
              <div className="flex-1 relative rounded-xl overflow-hidden border border-gray-700 bg-black">
                <Webcam
                  ref={webcamRef}
                  screenshotFormat="image/png"
                  mirrored={true}
                  className="w-full h-full object-cover"
                  videoConstraints={{ facingMode: "user" }}
                />
                {/* Scan Circle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-40 h-40 border-2 border-blue-400 rounded-full opacity-40 animate-pulse" />
                </div>
                <div className="absolute bottom-2 left-0 right-0 text-center">
                  <span className="text-blue-300 text-xs bg-black/60 px-3 py-1 rounded-full">
                    📍 Chehra frame mein rakho
                  </span>
                </div>
                {/* Label */}
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-lg">
                  📷 Live
                </div>
              </div>

              {/* Captured Preview */}
              <div
                className={`flex-1 rounded-xl overflow-hidden border-2 flex items-center justify-center bg-gray-800 ${
                  image ? "border-green-500" : "border-gray-700 border-dashed"
                }`}
              >
                {image ? (
                  <div className="relative w-full h-full">
                    <img
                      src={image}
                      alt="Captured"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-green-500 text-black text-xs font-bold px-2 py-1 rounded-lg">
                      ✅ Captured
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-4xl mb-2">📸</p>
                    <p className="text-gray-500 text-xs">Photo yahan dikhegi</p>
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={capturePhoto}
                className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
              >
                📸 Capture Photo
              </button>
              {image && (
                <button
                  onClick={() => {
                    setImage(null);
                    setResult(null);
                  }}
                  className="px-4 py-3 bg-gray-700 text-gray-300 rounded-xl text-sm hover:bg-gray-600 transition"
                >
                  🔄 Retake
                </button>
              )}
            </div>
          </div>
        )}

        {/* ✅ UPLOAD MODE */}
        {mode === "upload" && (
          <div className="flex flex-col flex-1 gap-3">
            {/* Upload + Preview side by side */}
            <div className="flex gap-3 flex-1">
              {/* Upload Area */}
              <label className="flex-1 flex flex-col items-center justify-center bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl cursor-pointer hover:border-purple-500 transition">
                <span className="text-4xl mb-2">📁</span>
                <span className="text-white text-sm font-medium">
                  Click to upload
                </span>
                <span className="text-gray-400 text-xs mt-1">JPG, PNG</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUpload}
                  className="hidden"
                />
              </label>

              {/* Upload Preview */}
              <div
                className={`flex-1 rounded-xl overflow-hidden border-2 flex items-center justify-center bg-gray-800 ${
                  image ? "border-purple-500" : "border-gray-700 border-dashed"
                }`}
              >
                {image ? (
                  <div className="relative w-full h-full">
                    <img
                      src={image}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                      📁 Uploaded
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-4xl mb-2">🖼️</p>
                    <p className="text-gray-500 text-xs">
                      Preview yahan dikhega
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Change Button */}
            {image && (
              <button
                onClick={() => {
                  setImage(null);
                  setResult(null);
                }}
                className="py-2.5 bg-gray-700 text-gray-300 rounded-xl text-sm hover:bg-gray-600 transition"
              >
                🔄 Change Photo
              </button>
            )}
          </div>
        )}

        {/* ✅ Verify Button */}
        <button
          onClick={handleVerify}
          disabled={loading || !image}
          className="mt-3 w-full py-3.5 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Verifying...
            </span>
          ) : (
            "Verify Now ✅"
          )}
        </button>
      </div>

      {/* RIGHT — Result */}
      <div className="w-64 bg-gray-900 rounded-2xl border border-gray-800 p-5 flex flex-col">
        <h2 className="text-white font-bold text-lg mb-4">📊 Result</h2>

        {/* Empty */}
        {!result && (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-3xl">
              🔍
            </div>
            <p className="text-gray-500 text-sm">
              Photo capture karo ya upload karo
            </p>
          </div>
        )}

        {/* Success */}
        {result && result.verified && (
          <div className="flex-1 flex flex-col gap-3">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-center">
              <div className="w-14 h-14 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center text-2xl mx-auto mb-2">
                👤
              </div>
              <h3 className="text-white font-bold text-lg">{result.name}</h3>
              <span className="inline-block mt-1 px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full capitalize">
                {result.role}
              </span>
            </div>

            <div className="bg-gray-800 rounded-xl p-3">
              <div className="flex justify-between mb-2">
                <p className="text-gray-400 text-xs">Match Score</p>
                <span className="text-green-400 font-bold text-sm">
                  {result.similarity}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${result.similarity}%` }}
                />
              </div>
            </div>

            <div className="bg-gray-800 rounded-xl p-3 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <p className="text-green-400 font-bold text-sm">Verified ✅</p>
            </div>
          </div>
        )}

        {/* Failed */}
        {result && !result.verified && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div className="w-16 h-16 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center text-3xl">
              ❌
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center w-full">
              <h3 className="text-red-400 font-bold">Not Recognized</h3>
              <p className="text-gray-400 text-xs mt-1">
                Database mein nahi mila
              </p>
            </div>
            <button
              onClick={() => {
                setResult(null);
                setImage(null);
              }}
              className="w-full py-2.5 bg-gray-800 text-gray-300 rounded-xl text-sm hover:bg-gray-700 transition"
            >
              🔄 Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
