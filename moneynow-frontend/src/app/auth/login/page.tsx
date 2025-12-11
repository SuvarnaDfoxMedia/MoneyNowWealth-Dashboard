// "use client";

// import React, { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [rememberMe, setRememberMe] = useState(false);

//   return (
//     <section
//       className="
//         min-h-screen flex flex-col items-center justify-center font-poppins
        
//         /* Apply height + bg image only for > sm screens */
//         sm:h-[980px]
//         sm:bg-[url('/images/login-bg.png')]
//         sm:bg-no-repeat sm:bg-center sm:bg-cover
//       "
//     >
//       {/* Logo */}
//       <div className="mb-6">
//         <Image
//           src="/images/moneynow-logo2.png"
//           alt="MoneyNow Logo"
//           width={160}
//           height={56}
//           className="h-14 w-auto mx-auto"
//           priority
//         />
//       </div>

//       {/* Form Card */}
//       <div className="bg-white pb-8 rounded-lg shadow-lg max-w-lg w-full">

//         {/* Header */}
//         <div className="border-b border-gray-300 p-4 sm:p-6 mb-6">
//           <h2 className="text-center text-[22px] sm:text-[32px] font-bold">
//             Welcome To MONEYNOW
//           </h2>

//           <p className="text-center text-[12px] sm:text-[14px] mt-1">
//             Already registered? <br /> If you have an account with us, please log in.
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
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block mb-1 text-[16px] font-semibold text-gray-700">
//               Password:<span className="text-red-500">*</span>
//             </label>
//             <input
//               type="password"
//               className="w-full border border-gray-300 rounded h-[50px] px-3
//                 focus:outline-none focus:ring-2 focus:ring-blue-600 
//                 focus:border-blue-600"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </div>

//           {/* Forgot + Remember */}
//           <div className="mb-5 text-sm text-gray-600">
//             <div className="text-right mb-2">
//              <Link
//   href="/auth/forgot-password"
//   className="text-[#FF0000] underline"
// >
//   Forgot your Password?
// </Link>

//             </div>

//             <label className="flex items-center gap-2">
//               <input
//                 type="checkbox"
//                 checked={rememberMe}
//                 onChange={() => setRememberMe(!rememberMe)}
//                 className="h-4 w-4 border-[#0774DE]"
//               />
//               Remember me
//             </label>
//           </div>

//           {/* Submit */}
//           <button
//             type="submit"
//             className="bg-[#043F79] hover:bg-[#002b6d] text-white py-[14px] px-[30px]
//               rounded text-[18px] font-semibold transition-colors uppercase "
//           >
//             Login Now
//           </button>

//           {/* Signup Link */}
//           <p className="text-center text-[14px] text-gray-600">
//             Not registered yet?{" "}
//            <Link
//   href="/auth/register"
//   className="text-[#355DEF] underline font-semibold"
// >
//   Sign Up Now
// </Link>

//           </p>

//         </form>
//       </div>
//     </section>
//   );
// };

// export default Login;



"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

const Login = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      toast.error("Please fill all required fields.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Login successful");
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        router.push("/dashboard"); // change to your route
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="
        min-h-screen flex flex-col items-center justify-center font-poppins
        sm:h-[980px] sm:bg-[url('/images/login-bg.png')] sm:bg-no-repeat sm:bg-center sm:bg-cover
      "
    >
      <Toaster position="top-right" reverseOrder={false} />

      {/* Logo */}
      <div className="mb-6">
        <Image
          src="/images/moneynow-logo2.png"
          alt="MoneyNow Logo"
          width={160}
          height={56}
          className="h-14 w-auto mx-auto"
          priority
        />
      </div>

      {/* Form Card */}
      <div className="bg-white pb-8 rounded-lg shadow-lg max-w-lg w-full">
        {/* Header */}
        <div className="border-b border-gray-300 p-4 sm:p-6 mb-6">
          <h2 className="text-center text-[22px] sm:text-[32px] font-bold">
            Welcome To MONEYNOW
          </h2>
          <p className="text-center text-[12px] sm:text-[14px] mt-1">
            Already registered? <br /> If you have an account with us, please log in.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-6 px-6 sm:px-8" onSubmit={handleLogin}>
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
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Password with Show/Hide */}
          <div>
            <label className="block mb-1 text-[16px] font-semibold text-gray-700">
              Password:<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full border border-gray-300 rounded h-[50px] px-3 pr-10
                  focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="absolute right-3 top-3 text-gray-500 text-lg cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
              </span>
            </div>
          </div>

          {/* Forgot + Remember */}
          <div className="mb-5 text-sm text-gray-600">
            <div className="text-right mb-2">
              <Link
                href="/auth/forgot-password"
                className="text-[#FF0000] underline"
              >
                Forgot your Password?
              </Link>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 border-[#0774DE]"
              />
              Remember me
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="bg-[#043F79] hover:bg-[#002b6d] text-white py-[14px] px-[30px]
              rounded text-[18px] font-semibold transition-colors uppercase"
          >
            {loading ? "Logging in..." : "Login Now"}
          </button>

          {/* Signup Link */}
          <p className="text-center text-[14px] text-gray-600">
            Not registered yet?{" "}
            <Link
              href="/auth/register"
              className="text-[#355DEF] underline font-semibold"
            >
              Sign Up Now
            </Link>
          </p>
        </form>
      </div>
    </section>
  );
};

export default Login;
