import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

// Types
interface VerifyResponse {
  verified?: boolean;
  name?: string;
  role?: string;
  similarity?: number;
  message?: string;
  error?: string;
}

// ✅ Verify API Function
export const verifyUser = async (image: string): Promise<VerifyResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/verify`, { image });
    return response.data;
  } catch (error: any) {
    return {
      error: error.response?.data?.error || "Something went wrong!"
    };
  }
};