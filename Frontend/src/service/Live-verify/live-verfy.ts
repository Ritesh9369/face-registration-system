import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

// Types
interface FaceResult {
  verified: boolean;
  name: string;
  role: string;
  similarity: number;
  bbox: number[];
  color: string;
}

interface LiveVerifyResponse {
  faces?: FaceResult[];
  error?: string;
}

// ✅ Live Verify API Function
export const liveVerifyUser = async (image: string): Promise<LiveVerifyResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/live-verify`, { image });
    return response.data;
  } catch (error: any) {
    return {
      error: error.response?.data?.error || "Something went wrong!"
    };
  }
};