import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import axios from "axios";

interface User {
  id: string;
  firstname?: string;
  lastname?: string;
  name?: string;
  email?: string;
  role?: string;
  profileImage?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
  );
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Prevent multiple refreshUser calls
  const refreshCalled = useRef(false);
  
  const clearAuth = () => {
    setUser(null);
    localStorage.removeItem("user");
  };


  const refreshUser = async () => {
  if (refreshCalled.current) return; // Already called, skip
  refreshCalled.current = true;

  try {
    const res = await axios.get(`${backendUrl}/api/profile`, { withCredentials: true });
    setUser(res.data);
    localStorage.setItem("user", JSON.stringify(res.data));
  } catch (err) {
    clearAuth();
  }
};

  const login = async (email: string, password: string) => {
    try {
      // Backend sets httpOnly cookie
      const res = await axios.post(
        `${backendUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      );

      if (!res.data.user) throw new Error("Invalid email or password");

      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err: any) {
      clearAuth();
      const msg = err.response?.data?.message || "Invalid email or password";
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      clearAuth();
    }
  };


  // Only call refreshUser once per mount/session
  useEffect(() => {
  const init = async () => {
    const cachedUser = localStorage.getItem("user");
    if (cachedUser) {
      await refreshUser();
    }
    setLoading(false);
  };
  init();
}, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
