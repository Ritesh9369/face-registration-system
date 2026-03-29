import axios from "axios";

const BASE_URL = "http://127.0.0.1:5000";

// Types
interface RegisterData {
  name: string;
  email: string;
  role: string;
  gender: string;
  image: string;
}

interface ApiResponse {
  message?: string;
  error?: string;
}

// ✅ Register API Function
export const registerUser = async (data: RegisterData): Promise<ApiResponse> => {
  try {
    const response = await axios.post(`${BASE_URL}/api/register`, data);
    return response.data;
  } catch (error: any) {
    return {
      error: error.response?.data?.error || "Something went wrong!"
    };
  }
};