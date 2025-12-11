// "use client";

// import React, { useState } from "react";
// import Image from "next/image";

// const ForgotPassword = () => {
//   const [email, setEmail] = useState("");

//   return (
//     <section
//       className="
//         min-h-screen 
//         flex flex-col items-center justify-center 
//       font-poppins

//         h-auto
//         md:h-[980px]

//         bg-none
//         md:bg-[url('/images/forgot-pass-bg.png')]
//         md:bg-no-repeat 
//         md:bg-center 
//         md:bg-cover
//       "
//     >

//       {/* Logo */}
//       <div className="mb-6">
//         <Image
//           src="/images/moneynow-logo2.png"
//           alt="MoneyNow Logo"
//           width={180}
//           height={60}
//           className="mx-auto h-14 w-auto"
//           priority
//         />
//       </div>

//       {/* Form Card */}
//       <div className="bg-white pb-8 rounded-lg shadow-lg max-w-md w-full">
        
//         {/* Header */}
//         <div className="border-b border-gray-300 p-4 sm:p-6 mb-6">
//           <h2 className="text-center text-[22px] sm:text-[32px] font-bold">
//             Forgot your password
//           </h2>
//           <p className="text-center text-[12px] sm:text-[14px] mt-1">
//             Retrieve your password here. Please enter your email address below.
//             You will receive a link to reset your password.
//           </p>
//         </div>

//         {/* Form */}
//         <form className="space-y-6 px-6 sm:px-8">
          
//           {/* Email */}
//           <div>
//             <label className="block mb-1 text-[16px] font-semibold text-gray-700">
//               Email:<span className="text-red-500">*</span>
//             </label>

//             <input
//               type="email"
//               className="w-full border border-gray-300 rounded h-[50px] px-3 
//                 focus:outline-none focus:ring-2 focus:ring-blue-600 
//                 focus:border-blue-600"
//               placeholder="Enter your email address"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           {/* Button */}
//           <button
//             type="submit"
//             className="bg-[#043F79] hover:bg-[#002b6d] text-white py-[14px] px-[30px]
//               rounded text-[18px] font-semibold transition-colors  uppercase"
//           >
//             Reset Password
//           </button>
//         </form>
//       </div>
//     </section>
//   );
// };

// export default ForgotPassword;



"use client";

import React, { useState } from "react";
import Image from "next/image";
import { toast, Toaster } from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), // 👈 sending email only
      });

      const result = await response.json(); // server message

      if (response.ok) {
        toast.success(result.message || "Password reset link sent to your email");
        setEmail("");
      } else {
        toast.error(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="
        min-h-screen 
        flex flex-col items-center justify-center 
        font-poppins
        h-auto
        md:h-[980px]
        bg-none
        md:bg-[url('/images/forgot-pass-bg.png')]
        md:bg-no-repeat 
        md:bg-center 
        md:bg-cover
      "
    >
      <Toaster position="top-right" />

      {/* Logo */}
      <div className="mb-6">
        <Image
          src="/images/moneynow-logo2.png"
          alt="MoneyNow Logo"
          width={180}
          height={60}
          className="mx-auto h-14 w-auto"
          priority
        />
      </div>

      {/* Form Card */}
      <div className="bg-white pb-8 rounded-lg shadow-lg max-w-md w-full">
        
        {/* Header */}
        <div className="border-b border-gray-300 p-4 sm:p-6 mb-6">
          <h2 className="text-center text-[22px] sm:text-[32px] font-bold">
            Forgot your password
          </h2>
          <p className="text-center text-[12px] sm:text-[14px] mt-1">
            Retrieve your password here. Enter your email address below and 
            you will receive a link to reset your password.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 px-6 sm:px-8">
          
          {/* Email */}
          <div>
            <label className="block mb-1 text-[16px] font-semibold text-gray-700">
              Email:<span className="text-red-500">*</span>
            </label>

            <input
              type="email"
              className="w-full border border-gray-300 rounded h-[50px] px-3 
                focus:outline-none focus:ring-2 focus:ring-blue-600 
                focus:border-blue-600"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#043F79] hover:bg-[#002b6d] text-white py-[14px] px-[30px]
              rounded text-[18px] font-semibold transition-colors uppercase w-full"
          >
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPassword;
