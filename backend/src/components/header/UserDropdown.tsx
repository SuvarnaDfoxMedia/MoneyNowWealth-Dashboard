import { useState, useEffect } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { useNavigate } from "react-router";
import axios from "axios";
import { toast } from "react-hot-toast";

interface User {
  firstname?: string;
  lastname?: string;
  name?: string;
  email?: string;
  profileImage?: string | null;
}

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [imageVersion, setImageVersion] = useState(Date.now()); // <-- NEW state
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }
  function closeDropdown() {
    setIsOpen(false);
  }

 useEffect(() => {
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/profile`, {
        withCredentials: true,
      });
      setUser(res.data);
      setImageVersion(Date.now());
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  fetchUser();

  // Poll every 30 seconds (30000 ms)
  const interval = setInterval(fetchUser, 300);

  return () => clearInterval(interval);
}, []);

  const handleLogout = async () => {
    closeDropdown();
    try {
      const res = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
      localStorage.removeItem("user");
      toast.success(res.data.message || "Logged out successfully!");
      setTimeout(() => navigate("/signin", { replace: true }), 900);
    } catch (err: any) {
      console.error("Logout failed:", err);
      toast.error(err.response?.data?.message || "Logout failed");
    }
  };

  // Determine display values
  const firstName = user?.firstname
    ?? (user?.name ? user.name.split(" ")[0] : "Admin");
  const lastName = user?.lastname
    ?? (user?.name ? user.name.split(" ").slice(1).join(" ") : "");
  const fullName = user ? `${firstName} ${lastName}`.trim() : "Admin";

  // Append imageVersion query param to bust cache and force refresh
  const profileImage = user?.profileImage
    ? `${backendUrl}${user.profileImage}?v=${imageVersion}`
    : "/images/user/owner.jpg";

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
      >
        <span className="mr-3 overflow-hidden rounded-full h-11 w-11 flex items-center justify-center bg-gray-100">
          <img
            src={profileImage}
            alt="User"
            className="w-full h-full object-cover rounded-full"
          />
        </span>
        <span className="block mr-1 font-medium text-theme-sm">
          {firstName}
        </span>
        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
      >
        <div>
          <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
            {fullName}
          </span>
          <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
            {user?.email ?? "email@example.com"}
          </span>
        </div>

        <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/profile"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Edit profile
            </DropdownItem>
          </li>
          <li>
            <DropdownItem
              onItemClick={closeDropdown}
              tag="a"
              to="/change-password"
              className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
            >
              Change Password
            </DropdownItem>
          </li>
        </ul>

        <DropdownItem
          onItemClick={handleLogout}
          tag="button"
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
        >
          Sign out
        </DropdownItem>
      </Dropdown>
    </div>
  );
}
