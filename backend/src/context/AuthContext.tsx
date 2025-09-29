import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  role: string | null;
  setAuth: (token: string, role: string) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [role, setRole] = useState(localStorage.getItem("role"));

  const setAuth = (token: string, role: string) => {
    setToken(token);
    setRole(role);
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);

    console.log("📦 setAuth called:", { token, role });//
  };

  const clearAuth = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    console.log("🧹 clearAuth called");//
  };

  return (
    <AuthContext.Provider value={{ token, role, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
