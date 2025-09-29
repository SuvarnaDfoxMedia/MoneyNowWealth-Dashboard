import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router";
import axios from "axios";

interface PrivateRouteProps {
  children: ReactNode;
  roles?: string[]; // allowed roles
}

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
}

export default function PrivateRoute({ children, roles }: PrivateRouteProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          withCredentials: true, // required for HttpOnly cookie
        });

        // 🔑 Handle both { user: {...} } and { ... } responses
        const userData = res.data?.user || res.data;
        setUser(userData);
        console.log("✅ Profile API response:", res.data);
      } catch (err) {
        console.error("❌ Profile fetch failed:", err);
        setUser(null); // invalid cookie or not logged in
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  console.log("🔎 PrivateRoute - loading:", loading, "user:", user);

  if (loading) return <p>Loading...</p>;

  // Redirect if not logged in
  if (!user) return <Navigate to="/signin" replace />;

  // Check roles
  if (roles && !roles.includes(user.role)) {
    return (
      <p className="p-5 text-red-500 font-bold">
        You do not have access to this dashboard!
      </p>
    );
  }

  return <>{children}</>;
}
