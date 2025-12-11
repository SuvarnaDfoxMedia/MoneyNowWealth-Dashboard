// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import axios from "axios";

// interface User {
//   id: string;
//   firstname?: string;
//   lastname?: string;
//   name?: string;
//   email?: string;
//   role?: string;
//   profileImage?: string | null;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   refreshUser: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(
//     localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
//   );
//   const [loading, setLoading] = useState(true);

//   const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

//   const clearAuth = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   const refreshUser = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/api/profile`, { withCredentials: true });
//       setUser(res.data);
//       localStorage.setItem("user", JSON.stringify(res.data));
//     } catch (err) {
//       clearAuth();
//     }
//   };

//   const login = async (email: string, password: string) => {
//     try {
//       // Backend sets httpOnly cookie
//       const res = await axios.post(
//         `${backendUrl}/api/auth/login`,
//         { email, password },
//         { withCredentials: true }
//       );

//       if (!res.data.user) throw new Error("Invalid email or password");

//       setUser(res.data.user);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//     } catch (err: any) {
//       clearAuth();
//       const msg = err.response?.data?.message || "Invalid email or password";
//       throw new Error(msg);
//     }
//   };

//   const logout = async () => {
//     try {
//       await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
//     } catch (err) {
//       console.error("Logout failed", err);
//     } finally {
//       clearAuth();
//     }
//   };

//   useEffect(() => {
//     const init = async () => {
//       await refreshUser();
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

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };


// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import axios from "axios";

// // ================== INTERFACES ==================
// interface User {
//   id: string;
//   firstname?: string;
//   lastname?: string;
//   name?: string;
//   email?: string;
//   role?: string;
//   profileImage?: string | null;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   refreshUser: () => Promise<void>;
// }

// // ================== CONTEXT CREATION ==================
// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// // ================== PROVIDER COMPONENT ==================
// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(
//     localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
//   );
//   const [loading, setLoading] = useState(true);

//   //  Use .env variable (defined in Vite)
//   const backendUrl = import.meta.env.VITE_API_BASE;

//   // Helper to clear auth state
//   const clearAuth = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   //  Refresh user profile (auto-login check)
//   const refreshUser = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/profile`, { withCredentials: true });
//       setUser(res.data);
//       localStorage.setItem("user", JSON.stringify(res.data));
//     } catch (err) {
//       clearAuth();
//     }
//   };

//   //  Login function
//   const login = async (email: string, password: string) => {
//     try {
//       const res = await axios.post(
//         `${backendUrl}/login`,
//         { email, password },
//         { withCredentials: true }
//       );

//       if (!res.data.user) throw new Error("Invalid email or password");

//       setUser(res.data.user);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//     } catch (err: any) {
//       clearAuth();
//       const msg = err.response?.data?.message || "Invalid email or password";
//       throw new Error(msg);
//     }
//   };

//   //  Logout function
//   const logout = async () => {
//     try {
//       await axios.post(`${backendUrl}/logout`, {}, { withCredentials: true });
//     } catch (err) {
//       console.error("Logout failed", err);
//     } finally {
//       clearAuth();
//     }
//   };

//   //  On mount → auto refresh user
//   useEffect(() => {
//     const init = async () => {
//       await refreshUser();
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

// // ================== CUSTOM HOOK ==================
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };



// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import axios from "axios";

// interface User {
//   id: string;
//   firstname?: string;
//   lastname?: string;
//   name?: string;
//   email?: string;
//   role?: string;
//   profileImage?: string | null;
// }

// interface AuthContextType {
//   user: User | null;
//   loading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => Promise<void>;
//   refreshUser: () => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(
//     localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null
//   );
//   const [loading, setLoading] = useState(true);

//   const backendUrl = import.meta.env.VITE_API_BASE; // http://localhost:5000/api

//   const clearAuth = () => {
//     setUser(null);
//     localStorage.removeItem("user");
//   };

//   const refreshUser = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/auth/profile`, { withCredentials: true });
//       const fetchedUser = res.data.user || res.data; // adapt depending on backend
//       if (JSON.stringify(fetchedUser) !== JSON.stringify(user)) {
//         setUser(fetchedUser);
//         localStorage.setItem("user", JSON.stringify(fetchedUser));
//       }
//     } catch (err) {
//       clearAuth();
//     }
//   };

//   const login = async (email: string, password: string) => {
//     try {
//       const res = await axios.post(
//         `${backendUrl}/auth/login`,
//         { email, password },
//         { withCredentials: true }
//       );

//       if (!res.data.user) throw new Error("Invalid email or password");

//       setUser(res.data.user);
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//     } catch (err: any) {
//       clearAuth();
//       const msg = err.response?.data?.message || "Invalid email or password";
//       throw new Error(msg);
//     }
//   };

//   const logout = async () => {
//     try {
//       await axios.post(`${backendUrl}/auth/logout`, {}, { withCredentials: true });
//     } catch (err) {
//       console.error("Logout failed", err);
//     } finally {
//       clearAuth();
//     }
//   };

//   useEffect(() => {
//     const init = async () => {
//       await refreshUser();
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

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };



// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import axios from "axios";

// interface User {
//   id: string;
//   firstname?: string;
//   lastname?: string;
//   email?: string;
//   role?: string;
//   profileImage?: string | null;
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

//   const refreshUser = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/auth/profile`, { withCredentials: true });
//       const fetchedUser = res.data.user || res.data;
//       setUser(fetchedUser);
//     } catch {
//       clearAuth();
//     }
//   };

//   const login = async (email: string, password: string) => {
//     try {
//       const res = await axios.post(
//         `${backendUrl}/auth/login`,
//         { email, password },
//         { withCredentials: true }
//       );
//       if (!res.data.user) throw new Error("Invalid email or password");
//       setUser(res.data.user);
//     } catch (err: any) {
//       clearAuth();
//       const msg = err.response?.data?.message || "Invalid email or password";
//       throw new Error(msg);
//     }
//   };

//   const logout = async () => {
//     try {
//       await axios.post(`${backendUrl}/auth/logout`, {}, { withCredentials: true });
//     } catch (err) {
//       console.error("Logout failed", err);
//     } finally {
//       clearAuth();
//       window.location.href = "/signin"; // redirect after logout
//     }
//   };

//   // Automatically refresh user on app load
//   useEffect(() => {
//     const init = async () => {
//       await refreshUser();
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

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };

// // ---------------------- Helper for axios interceptor ----------------------
// export const refreshAuthUser = async () => {
//   try {
//     const res = await axios.get(`${backendUrl}/auth/profile`, { withCredentials: true });
//     return res.data.user;
//   } catch {
//     throw new Error("Refresh failed");
//   }
// };

// export const logoutAuth = async () => {
//   try {
//     await axios.post(`${backendUrl}/auth/logout`, {}, { withCredentials: true });
//   } catch {}
// };




// import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import axios from "axios";

// export interface User {
//   id: string;
//   firstname?: string;
//   lastname?: string;
//   email?: string;
//  role: "admin" | "user" | "editor"; 
//    profileImage?: string | null;
//   phone?: string;    // <-- added
//   address?: string;  // <-- added
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

//   const refreshUser = async () => {
//     try {
//       const res = await axios.get(`${backendUrl}/auth/profile`, { withCredentials: true });
//       const fetchedUser = res.data.user || res.data;
//       setUser(fetchedUser);
//     } catch {
//       clearAuth();
//     }
//   };

//   const login = async (email: string, password: string) => {
//     try {
//       const res = await axios.post(
//         `${backendUrl}/auth/login`,
//         { email, password },
//         { withCredentials: true }
//       );
//       if (!res.data.user) throw new Error("Invalid email or password");
//       setUser(res.data.user);
//     } catch (err: any) {
//       clearAuth();
//       const msg = err.response?.data?.message || "Invalid email or password";
//       throw new Error(msg);
//     }
//   };

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

//   useEffect(() => {
//     const init = async () => {
//       await refreshUser();
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

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) throw new Error("useAuth must be used within AuthProvider");
//   return context;
// };

// // Optional helpers
// export const refreshAuthUser = async () => {
//   try {
//     const res = await axios.get(`${backendUrl}/auth/profile`, { withCredentials: true });
//     return res.data.user;
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
      const res = await axios.get(`${backendUrl}/auth/profile`, { withCredentials: true });
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
