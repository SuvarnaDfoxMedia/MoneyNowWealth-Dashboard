// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

// const SetNewPassword = () => {
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);

//   return (
//     <section
//       className="
//         min-h-screen flex flex-col items-center justify-center 
//         bg-no-repeat bg-center bg-cover
//         md:bg-[url('/images/set-new-pass-bg.png')]
//         md:h-[980px]
//         font-poppins
//       "
//       style={{ backgroundSize: "cover" }}
//     >
//       {/* Logo */}
//       <div className="mb-6">
//         <Image
//           src="/images/moneynow-logo2.png"
//           alt="MoneyNow Logo"
//           width={200}
//           height={60}
//           className="h-14 w-auto mx-auto"
//           priority
//         />
//       </div>

//       {/* Card */}
//       <div className="bg-white pb-8 rounded-lg shadow-lg max-w-md w-full">
        
//         {/* Header */}
//         <div className="border-b border-gray-300 p-4 sm:p-6 mb-6">
//           <h2 className="text-center text-[22px] sm:text-[32px] font-bold">
//             Set New Password
//           </h2>
//           <p className="text-center text-[12px] sm:text-[14px]">
//             For better security, choose a strong and unique password.
//           </p>
//         </div>

//         {/* Form */}
//         <form className="space-y-6 px-6 sm:px-8">

//           {/* New Password */}
//           <div>
//             <label className="block mb-1 text-[16px] font-semibold text-gray-700">
//               New Password<span className="text-red-500">*</span>
//             </label>

//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 className="w-full border border-gray-300 rounded h-[50px] px-3 pr-10
//                            focus:outline-none focus:ring-2 focus:ring-blue-600 
//                            focus:border-blue-600"
//                 placeholder="Enter new password"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
//               >
//                 {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
//               </button>
//             </div>
//           </div>

//           {/* Confirm Password */}
//           <div>
//             <label className="block mb-1 text-[16px] font-semibold text-gray-700">
//               Confirm New Password<span className="text-red-500">*</span>
//             </label>

//             <div className="relative">
//               <input
//                 type={showConfirmPassword ? "text" : "password"}
//                 className="w-full border border-gray-300 rounded h-[50px] px-3 pr-10
//                            focus:outline-none focus:ring-2 focus:ring-blue-600 
//                            focus:border-blue-600"
//                 placeholder="Confirm new password"
//               />

//               <button
//                 type="button"
//                 onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                 className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
//               >
//                 {showConfirmPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
//               </button>
//             </div>
//           </div>

//           {/* Requirement Text */}
//           <p className="text-[12px] sm:text-[14px] text-gray-700">
//             Your password must be at least 10 characters. Include multiple words
//             and phrases to make it more secure.
//           </p>

//           {/* Button */}
//           <button
//             type="submit"
//             className="bg-[#043F79] hover:bg-[#002b6d] text-white py-[14px] px-[30px]
//                        rounded text-[18px] font-semibold transition-colors "
//           >
//             UPDATE PASSWORD
//           </button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default SetNewPassword;



"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const SetNewPassword = () => {
  const router = useRouter();

  // Extract token from URL
  const token =
    typeof window !== "undefined"
      ? window.location.pathname.split("/").pop()
      : "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmPassword)
      return toast.error("All fields are required");

    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    if (newPassword.length < 10)
      return toast.error("Password must be at least 10 characters long");

    if (!token) return toast.error("Invalid or missing token");

    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            password: newPassword,
            confirmPassword: confirmPassword,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Failed to reset password");
        return;
      }

      toast.success("Password reset successfully!");
      setTimeout(() => router.push("/auth/login"), 1500);

    } catch (error) {
      console.error(error);
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center 
      bg-no-repeat bg-center bg-cover
      md:bg-[url('/images/set-new-pass-bg.png')]
      md:h-[980px] font-poppins"
      style={{ backgroundSize: "cover" }}
    >
      <Toaster position="top-right" />

      <div className="mb-6">
        <Image
          src="/images/moneynow-logo2.png"
          alt="MoneyNow Logo"
          width={200}
          height={60}
          className="h-14 w-auto mx-auto"
          priority
        />
      </div>

      <div className="bg-white pb-8 rounded-lg shadow-lg max-w-md w-full">
        <div className="border-b border-gray-300 p-4 sm:p-6 mb-6">
          <h2 className="text-center text-[22px] sm:text-[32px] font-bold">
            Set New Password
          </h2>
          <p className="text-center text-[12px] sm:text-[14px]">
            Create a strong new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 sm:px-8">

          {/* NEW PASSWORD */}
          <div>
            <label className="block mb-1 text-[16px] font-semibold text-gray-700">
              New Password<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                className="w-full border border-gray-300 rounded h-[50px] px-3 pr-10 
                focus:outline-none focus:ring-2 focus:ring-blue-600 
                focus:border-blue-600"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div>
            <label className="block mb-1 text-[16px] font-semibold text-gray-700">
              Confirm New Password<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                className="w-full border border-gray-300 rounded h-[50px] px-3 pr-10 
                focus:outline-none focus:ring-2 focus:ring-blue-600 
                focus:border-blue-600"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <AiOutlineEye />
                ) : (
                  <AiOutlineEyeInvisible />
                )}
              </button>
            </div>
          </div>

          <p className="text-[12px] sm:text-[14px] text-gray-700">
            Password must be at least 10 characters.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#043F79] hover:bg-[#002b6d] text-white py-[14px] px-[30px]
            rounded text-[18px] font-semibold transition-colors "
          >
            {loading ? "Updating..." : "UPDATE PASSWORD"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default SetNewPassword;
