<<<<<<< HEAD


import axios from "axios";

const API_URL = `${import.meta.env.VITE_API_BASE}`;

// -------------------- LOGIN --------------------
=======
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; 

>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
export const login = async (credentials: { email: string; password: string }) => {
  return axios.post(`${API_URL}/login`, credentials, { withCredentials: true });
};

<<<<<<< HEAD
// -------------------- SIGNUP --------------------
=======
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
export const signup = async (userData: {
  fname: string;
  lname: string;
  email: string;
  password: string;
<<<<<<< HEAD
  termsAccepted: boolean;
=======
  termsAccepted: boolean; 
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
}) => {
  if (!userData.termsAccepted) {
    throw new Error("You must accept the terms and conditions");
  }
<<<<<<< HEAD

  return axios.post(`${API_URL}/register`, userData, { withCredentials: true });
};

// -------------------- LOGOUT --------------------
export const logout = async (navigate: any) => {
  try {
    await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    localStorage.removeItem("user");
    navigate("/signin");
  } catch (err) {
    console.error("Logout failed:", err);
  }
};
=======
  return axios.post(`${API_URL}/register`, userData, { withCredentials: true });
};

export const logout = async (navigate: any) => {
  try {
    await axios.post("/api/auth/logout", {}, { withCredentials: true }); 
    localStorage.removeItem("user"); 
    navigate("/signin"); 
  } catch (err) {
    console.error("Logout failed:", err);
  }
};
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
