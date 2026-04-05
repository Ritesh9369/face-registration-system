import { useRef, useEffect, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { liveVerifyUser } from "../../service/Live-verify/live-verfy";

export default function LiveVerify() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState([]);
  const [currentFace, setCurrentFace] = useState(null);
  const intervalRef = useRef(null);

  // ✅ Auto Start
  useEffect(() => {
    const timer = setTimeout(() => {
      startVerification();
    }, 2000);
    return () => {
      clearTimeout(timer);
      clearInterval(intervalRef.current);
    };
  }, []);

  const addLog = (name, role, similarity, verified) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [
      { name, role, similarity, verified, time },
      ...prev.slice(0, 19)
    ]);
  };

  // ✅ Canvas pe box + name draw karo — NAME SEEDHA
  const drawBoxes = useCallback((faces) => {
    const canvas = canvasRef.current;
    const webcam = webcamRef.current;
    if (!canvas || !webcam) return;

    const video = webcam.video;
    if (!video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    faces.forEach((face) => {
      const [x1, y1, x2, y2] = face.bbox;

      // ✅ Mirror fix — x coordinates flip karo
      const mx1 = canvas.width - x2;
      const mx2 = canvas.width - x1;

      const color = face.verified ? "#00ff00" : "#ff0000";
      const w = mx2 - mx1;
      const h = y2 - y1;

      // ✅ Glow
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;

      // ✅ Box
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.strokeRect(mx1, y1, w, h);

      // ✅ Corners
      const corner = 20;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(mx1, y1 + corner);
      ctx.lineTo(mx1, y1);
      ctx.lineTo(mx1 + corner, y1);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mx2 - corner, y1);
      ctx.lineTo(mx2, y1);
      ctx.lineTo(mx2, y1 + corner);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mx1, y2 - corner);
      ctx.lineTo(mx1, y2);
      ctx.lineTo(mx1 + corner, y2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(mx2 - corner, y2);
      ctx.lineTo(mx2, y2);
      ctx.lineTo(mx2, y2 - corner);
      ctx.stroke();

      ctx.shadowBlur = 0;

      // ✅ Name tag — SEEDHA
      const label = face.verified
        ? `${face.name} • ${face.similarity}%`
        : "Unknown ❌";
      ctx.font = "bold 16px Arial";
      const textW = ctx.measureText(label).width + 16;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(mx1, y1 - 35, textW, 30, 6);
      ctx.fill();

      ctx.fillStyle = face.verified ? "#000" : "#fff";
      ctx.fillText(label, mx1 + 8, y1 - 14);
    });
  }, []);

  // ✅ Capture + Verify
  const captureAndVerify = useCallback(async () => {
    if (!webcamRef.current) return;
    const image = webcamRef.current.getScreenshot();
    if (!image) return;

    try {
      const result = await liveVerifyUser(image);

      if (result.faces && result.faces.length > 0) {
        drawBoxes(result.faces);
        const verified = result.faces.find((f) => f.verified);
        setCurrentFace(verified || null);

        result.faces.forEach((face) => {
          if (face.verified) {
            addLog(face.name, face.role, face.similarity, true);
          } else {
            addLog("Unknown", "", 0, false);
          }
        });
      } else {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        setCurrentFace(null);
      }
    } catch (e) {
      console.error(e);
    }
  }, [drawBoxes]);

  const startVerification = useCallback(() => {
    setIsRunning(true);
    intervalRef.current = setInterval(captureAndVerify, 1000);
  }, [captureAndVerify]);

  const toggleVerification = () => {
    if (isRunning) {
      clearInterval(intervalRef.current);
      setIsRunning(false);
      setCurrentFace(null);
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    } else {
      startVerification();
    }
  };

  return (
    <div className="h-screen w-full bg-gray-950 flex overflow-hidden">
      {/* LEFT — Camera */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 gap-4">
        <h1 className="text-2xl font-bold text-white">
          🎥 Live Face Verification
        </h1>

        {/* Camera + Canvas */}
        <div className="relative w-full max-w-xl rounded-2xl overflow-hidden border-2 border-gray-700 bg-black">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/png"
            mirrored={true}
            className="w-full"
            videoConstraints={{ facingMode: "user" }}
          />
          {/* ✅ Canvas — NO mirror transform */}
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />

          {/* Bottom Overlay */}
          {currentFace && (
            <div className="absolute bottom-3 left-3 right-3 bg-green-500/20 backdrop-blur border border-green-500/50 rounded-xl px-4 py-2 flex items-center gap-3">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <div>
                <p className="text-green-400 font-bold text-sm">
                  {currentFace.name}
                </p>
                <p className="text-gray-300 text-xs">
                  {currentFace.role} • {currentFace.similarity}% match
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Status + Button */}
        <div className="flex items-center gap-4">
          <div
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              isRunning
                ? "bg-green-500/20 text-green-400 border-green-500"
                : "bg-gray-800 text-gray-400 border-gray-700"
            }`}
          >
            {isRunning ? "🟢 Running..." : "⚪ Stopped"}
          </div>

          <button
            onClick={toggleVerification}
            className={`px-8 py-3 rounded-xl font-bold text-white transition ${
              isRunning
                ? "bg-red-600 hover:bg-red-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isRunning ? "⏹ Stop" : "▶ Start"}
          </button>
        </div>
      </div>

      {/* RIGHT — Logs */}
      <div className="w-80 bg-gray-900 border-l border-gray-800 flex flex-col">
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg">📋 Live Logs</h2>
          <p className="text-gray-400 text-xs mt-1">Real-time results</p>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {logs.length === 0 && (
            <p className="text-gray-500 text-sm text-center mt-8">
              Verification start karo...
            </p>
          )}

          {logs.map((log, index) => (
            <div
              key={index}
              className={`p-3 rounded-xl border ${
                log.verified
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-red-500/10 border-red-500/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`font-bold text-sm ${
                    log.verified ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {log.verified ? "✅" : "❌"} {log.name}
                </span>
                <span className="text-gray-500 text-xs">{log.time}</span>
              </div>
              {log.verified && (
                <p className="text-gray-400 text-xs mt-1">
                  {log.role} • {log.similarity}% match
                </p>
              )}
            </div>
          ))}
        </div>

        {logs.length > 0 && (
          <div className="p-3 border-t border-gray-800">
            <button
              onClick={() => setLogs([])}
              className="w-full py-2 bg-gray-800 text-gray-400 rounded-xl text-sm hover:bg-gray-700 transition"
            >
              🗑 Clear Logs
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
