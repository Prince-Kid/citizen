import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/lib/services/auth";
import { User } from "@/lib/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authService
        .getCurrentUser()
        .then((response: unknown) => {
          setUser(response as User);
        })
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { user, token } = await authService.login(email, password);
      localStorage.setItem("token", token);
      setUser(user);
      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const { user, token } = await authService.register({
        name,
        email,
        password,
      });
      localStorage.setItem("token", token);
      setUser(user);
      router.push("/dashboard");
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    router.push("/");
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
