import { useState, useRef, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import Swal from "sweetalert2";
import { registerUser } from "../../service/Rigister/Rigister";

export default function Register() {
  const webcamRef = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    gender: ""
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // ✅ Auto Camera Open
  useEffect(() => {
    // Page load hote hi camera on
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const capturePhoto = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
  }, [webcamRef]);

  const validate = () => {
    if (!formData.name.trim()) {
      Swal.fire("Error!", "Name is required!", "error");
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      Swal.fire("Error!", "Valid email is required!", "error");
      return false;
    }
    if (!formData.role) {
      Swal.fire("Error!", "Please select a role!", "error");
      return false;
    }
    if (!formData.gender) {
      Swal.fire("Error!", "Please select gender!", "error");
      return false;
    }
    if (!image) {
      Swal.fire("Error!", "Please capture your photo!", "error");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    const result = await registerUser({
      name: formData.name,
      email: formData.email,
      role: formData.role,
      gender: formData.gender,
      image: image
    });

    if (result.error) {
      Swal.fire("Error!", result.error, "error");
    } else {
      Swal.fire("Success! 🎉", result.message, "success");
      setFormData({ name: "", email: "", role: "", gender: "" });
      setImage(null);
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-full bg-gray-950 flex items-center justify-center overflow-hidden">
      <div className="w-full max-w-5xl h-full flex items-center gap-6 px-6">
        {/* LEFT — Form */}
        <div className="flex-1 bg-gray-900 rounded-2xl border border-gray-800 p-6 h-fit">
          <h1 className="text-2xl font-bold text-white mb-1">Register Face</h1>
          <p className="text-gray-400 text-sm mb-5">
            Fill details and capture photo
          </p>

          {/* Name */}
          <div className="mb-3">
            <label className="text-gray-300 text-xs font-medium mb-1 block">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 outline-none border border-gray-700 focus:border-blue-500 transition text-sm"
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="text-gray-300 text-xs font-medium mb-1 block">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 outline-none border border-gray-700 focus:border-blue-500 transition text-sm"
            />
          </div>

          {/* Role */}
          <div className="mb-3">
            <label className="text-gray-300 text-xs font-medium mb-1 block">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-2.5 outline-none border border-gray-700 focus:border-blue-500 transition text-sm"
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="employee">Employee</option>
              <option value="student">Student</option>
              <option value="visitor">Visitor</option>
            </select>
          </div>

          {/* Gender */}
          <div className="mb-5">
            <label className="text-gray-300 text-xs font-medium mb-2 block">
              Gender
            </label>
            <div className="flex gap-2">
              {["male", "female", "other"].map((g) => (
                <button
                  key={g}
                  onClick={() => setFormData({ ...formData, gender: g })}
                  className={`flex-1 py-2 rounded-xl border text-xs font-medium capitalize transition ${
                    formData.gender === g
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-gray-800 border-gray-700 text-gray-300 hover:border-blue-500"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Registering... ⏳" : "Register ✅"}
          </button>
        </div>

        {/* RIGHT — Camera */}
        <div className="flex-1 bg-gray-900 rounded-2xl border border-gray-800 p-6 h-fit">
          <h2 className="text-white font-bold text-lg mb-1">Face Camera</h2>
          <p className="text-gray-400 text-xs mb-4">
            Camera automatically opens
          </p>

          {/* Camera Always On */}
          {!image && (
            <div>
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/png"
                className="w-full rounded-xl border border-gray-700"
                mirrored={true}
              />
              <button
                onClick={capturePhoto}
                className="w-full mt-3 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
              >
                📸 Capture Photo
              </button>
            </div>
          )}

          {/* Captured Image */}
          {image && (
            <div>
              <img
                src={image}
                alt="Captured"
                className="w-full rounded-xl border-2 border-green-500"
              />
              <div className="mt-2 text-center text-green-400 text-sm font-medium mb-3">
                ✅ Photo Captured!
              </div>
              <button
                onClick={() => setImage(null)}
                className="w-full py-2.5 bg-gray-700 text-gray-300 rounded-xl text-sm hover:bg-gray-600 transition"
              >
                🔄 Retake Photo
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
