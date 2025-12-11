<<<<<<< HEAD
// import React from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext";

// interface PrivateRouteProps {
//   roles: string[];
//   children: JSX.Element;
// }

// const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles, children }) => {
//   const { user, loading } = useAuth();

//   if (loading) return <p className="p-5 text-center">Loading...</p>;

//   if (!user) return <Navigate to="/signin" replace />;

//   if (!roles.includes(user.role)) return <Navigate to="/" replace />;

//   return children;
// };

// export default PrivateRoute;

=======
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface PrivateRouteProps {
  roles: string[];
<<<<<<< HEAD
  children: React.ReactNode;
=======
  children: JSX.Element;
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ roles, children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p className="p-5 text-center">Loading...</p>;
<<<<<<< HEAD
  if (!user) return <Navigate to="/signin" replace />;

  const role = user.role;
  if (!role || !roles.includes(role)) return <Navigate to="/" replace />;

  return <>{children}</>;
=======

  if (!user) return <Navigate to="/signin" replace />;

  if (!roles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
};

export default PrivateRoute;
