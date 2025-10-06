import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface User {
  id: string;
  firstname?: string;
  lastname?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  role?: string;
  profileImage?: string | null;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  const refreshUser = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/profile`, { withCredentials: true });
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
