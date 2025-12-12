// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import axios from "axios";

// export interface User {
//   id: string;
//   firstname?: string;
//   lastname?: string;
//   email?: string;
//   role: "admin" | "user" | "editor";
//   profileImage?: string | null;
//   phone?: string;
//   address?: string;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   refreshUser: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);
// const backendUrl = import.meta.env.VITE_API_BASE;

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   const clearAuth = () => setUser(null);

//   /* ------------------------------ REFRESH USER ------------------------------ */
//   const refreshUser = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/profile`, { withCredentials: true });
//       const data = res.data.user || res.data;

//       const [firstname = "", lastname = ""] = data.name ? data.name.split(" ") : ["", ""];

//       setUser({
//         ...data,
//         firstname,
//         lastname,
//       });
//     } catch {
//       try {
//         const res = await axios.get(`${backendUrl}/get-profile`, { withCredentials: true });
//         setUser(res.data.user || res.data);
//       } catch {
//         clearAuth();
//       }
//     }
//   };

//   /* ------------------------------ LOGIN ------------------------------ */
//   const login = async (email: string, password: string) => {
//     try {
//       const res = await axios.post(
//         `${backendUrl}/auth/login`,
//         { email, password },
//         { withCredentials: true }
//       );

//       if (!res.data.user) throw new Error("Invalid credentials");

//       const data = res.data.user;
//       const [firstname = "", lastname = ""] = data.name ? data.name.split(" ") : ["", ""];

//       setUser({
//         ...data,
//         firstname,
//         lastname,
//       });
//     } catch (err: any) {
//       clearAuth();
//       const msg = err.response?.data?.message || "Invalid email or password";
//       throw new Error(msg);
//     }
//   };

//   /* ------------------------------ LOGOUT ------------------------------ */
//   const logout = async () => {
//     try {
//       await axios.post(`${backendUrl}/auth/logout`, {}, { withCredentials: true });
//     } catch (err) {
//       console.error("Logout failed", err);
//     } finally {
//       clearAuth();
//       window.location.href = "/signin";
//     }
//   };

//   /* ------------------------------ INITIAL LOAD ------------------------------ */
//   useEffect(() => {
//     const init = async () => {
//       // await refreshUser(); // Uncomment if you want to fetch user on app load
//       setLoading(false);
//     };
//     init();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// /* ------------------------------ USE AUTH HOOK ------------------------------ */
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };

// /* ------------------------------ EXTRA HELPERS ------------------------------ */
// export const refreshAuthUser = async () => {
//   try {
//     const res = await axios.get(`${backendUrl}/profile`, { withCredentials: true });
//     const data = res.data.user || res.data;
//     const [firstname = "", lastname = ""] = data.name ? data.name.split(" ") : ["", ""];
//     return { ...data, firstname, lastname };
//   } catch {
//     throw new Error("Refresh failed");
//   }
// };

// export const logoutAuth = async () => {
//   try {
//     await axios.post(`${backendUrl}/auth/logout`, {}, { withCredentials: true });
//   } catch {}
// };





import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

export interface User {
  id: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  role: "admin" | "user" | "editor";
  profileImage?: string | null;
  phone?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const backendUrl = import.meta.env.VITE_API_BASE;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const clearAuth = () => setUser(null);

  const refreshUser = async () => {
    try {
      
      const res = await axios.get(`${backendUrl}/get-profile`, { withCredentials: true });
      setUser(res.data.user || res.data);
    } catch {
      clearAuth();
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post(
        `${backendUrl}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      if (!res.data.user) throw new Error("Invalid email or password");
      setUser(res.data.user);
    } catch (err: any) {
      clearAuth();
      const msg = err.response?.data?.message || "Invalid email or password";
      throw new Error(msg);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${backendUrl}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      clearAuth();
      window.location.href = "/signin";
    }
  };

  useEffect(() => {
    const init = async () => {
      
      await refreshUser();
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

// Optional helpers for axios interceptors
export const refreshAuthUser = async () => {
  try {
    const res = await axios.get(`${backendUrl}/auth/profile`, { withCredentials: true });
    return res.data.user;
  } catch {
    throw new Error("Refresh failed");
  }
};

export const logoutAuth = async () => {
  try {
    await axios.post(`${backendUrl}/auth/logout`, {}, { withCredentials: true });
  } catch {}
};
