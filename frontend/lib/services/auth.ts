import api from "../api";
import { User } from "../types";

interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const authService = {
  async register(data: RegisterData) {
    try {
      const response = await api.post<LoginResponse>("/auth/register", data);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Registration failed");
      }
      throw new Error("Network error occurred");
    }
  },

  async login(email: string, password: string) {
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || "Login failed");
      }
      throw new Error("Network error occurred");
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem("token");
    await api.post("/auth/logout");
  },

  async getCurrentUser() {
    const response = await api.get("/auth/me");
    return response.data;
  },
};
