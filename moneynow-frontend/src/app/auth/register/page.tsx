
// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import intlTelInput from "intl-tel-input";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import Link from "next/link";
// import { toast, Toaster } from "react-hot-toast";
// import type { IntlTelInputInstance } from "intl-tel-input";

// const Register = () => {
//   const phoneRef = useRef<HTMLInputElement | null>(null);
//   const itiInstanceRef = useRef<IntlTelInputInstance | null>(null);

//   const [title, setTitle] = useState("Mr");
//   const [firstname, setFirstname] = useState("");
//   const [lastname, setLastname] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     if (phoneRef.current) {
//       const iti = intlTelInput(phoneRef.current, {
//         initialCountry: "in",
//         separateDialCode: true,
//         utilsScript:
//           "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.0/build/js/utils.js",
//       });

//       itiInstanceRef.current = iti;
//       iti.setNumber(""); // leave input empty initially
//       return () => iti.destroy();
//     }
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!termsAccepted) {
//       toast.error("Please accept the terms and conditions.");
//       return;
//     }

//     let mobile = "";
//     let countryCode = "+91"; // default country code

//     if (itiInstanceRef.current && phoneRef.current) {
//       const iti = itiInstanceRef.current;
//       const countryData = iti.getSelectedCountryData();
//       countryCode = countryData.dialCode ? "+" + countryData.dialCode : "+91"; // fallback
//       mobile = phoneRef.current.value.trim();
//     }

//     if (!mobile) {
//       toast.error("Please enter your contact number.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title,
//           firstname,
//           lastname,
//           email,
//           password,
//           mobile,
//           countryCode,
//           termsAccepted,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success("Registration successful!");
//         // Reset form
//         setTitle("Mr");
//         setFirstname("");
//         setLastname("");
//         setEmail("");
//         setPassword("");
//         setTermsAccepted(false);
//         if (itiInstanceRef.current) itiInstanceRef.current.setNumber(""); // reset phone input
//       } else {
//         toast.error(data.message || "Registration failed");
//       }
//     } catch (error) {
//       console.error(error);
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="w-full my-0 md:bg-[url('/images/register-bg-3.png')] bg-no-repeat bg-cover bg-center">
//       <Toaster position="top-right" reverseOrder={false} />
//       <div className="container mx-auto px-5 md:px-8 py-18">
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
//           {/* LEFT SECTION */}
//           <div className="md:col-span-7 self-center">
//             <img
//               src="/images/moneynow-logo2.png"
//               className="mb-8 md:mb-[50px] w-[180px] md:w-auto"
//             />
//             <h1 className="text-[28px] md:text-[36px] font-bold leading-[40px] md:leading-[52px] text-black mb-[20px] md:mb-[40px]">
//               Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit
//             </h1>
//             <p className="text-[16px] md:text-[18px] font-inter mb-[20px] md:mb-[30px] leading-[35px]">
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//             </p>
//           </div>

//           {/* RIGHT SECTION */}
//           <div className="md:col-span-5">
//             <div className="bg-white border rounded-[10px] border-gray-200 shadow-sm">
//               <div className="border-b border-[#E8E8E8] text-center p-4 md:p-6">
//                 <h2 className="text-[26px] md:text-[32px] font-bold mb-1">Register User</h2>
//                 <p className="text-[14px]">Welcome! Please fill the details</p>
//               </div>

//               <div className="p-4 md:p-6">
//                 <form onSubmit={handleSubmit}>
//                   {/* Title */}
//                   <div className="flex items-center gap-3 mb-[12px] md:mb-[18px]">
//                     <label className="text-[16px] text-gray-700 whitespace-nowrap">
//                       Title<span className="text-red-500">*</span>
//                     </label>
//                     {["Mr", "Mrs"].map((t) => (
//                       <label key={t} className="flex items-center gap-2 text-gray-700 text-sm">
//                         <input
//                           type="radio"
//                           name="title"
//                           value={t}
//                           checked={title === t}
//                           onChange={() => setTitle(t)}
//                           className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//                         />
//                         {t}
//                       </label>
//                     ))}
//                   </div>

//                   {/* First Name */}
//                   <div className="mb-[12px] md:mb-[18px]">
//                     <label className="text-[16px] block mb-1">
//                       First Name<span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={firstname}
//                       onChange={(e) => setFirstname(e.target.value)}
//                       className="w-full h-[46px] md:h-[48px] border border-[#E8E8E8] px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>

//                   {/* Last Name */}
//                   <div className="mb-[12px] md:mb-[18px]">
//                     <label className="text-[16px] block mb-1">
//                       Last Name<span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={lastname}
//                       onChange={(e) => setLastname(e.target.value)}
//                       className="w-full h-[46px] md:h-[48px] border border-[#E8E8E8] px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>

//                   {/* Email */}
//                   <div className="mb-[12px] md:mb-[18px]">
//                     <label className="text-[16px] block mb-1">
//                       Email<span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="w-full h-[46px] md:h-[48px] border border-[#E8E8E8] px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>

//                   {/* Phone */}
//                   <div className="mb-[12px] md:mb-[18px]">
//                     <label className="text-[16px] block mb-1">
//                       Contact Number<span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       ref={phoneRef}
//                       type="tel"
//                       className="w-full h-[46px] md:h-[48px] border border-[#E8E8E8] px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                     />
//                   </div>

//                   {/* Password */}
//                   <div className="mb-[12px] md:mb-[18px]">
//                     <label className="text-[16px] block mb-1">
//                       Password<span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full h-[46px] md:h-[48px] border border-[#E8E8E8] px-3 pr-10 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//                       />
//                       <span
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-3 md:top-3.5 text-gray-500 text-lg cursor-pointer"
//                       >
//                         {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Terms */}
//                   <label className="flex items-center mb-[12px] md:mb-[18px] gap-2 text-[14px] text-gray-700">
//                     <input
//                       type="checkbox"
//                       checked={termsAccepted}
//                       onChange={(e) => setTermsAccepted(e.target.checked)}
//                       className="h-4 w-4 border-[#0774DE]"
//                     />
//                     <span>
//                       I agree to the{" "}
//                       <span className="text-[#355DEF] cursor-pointer">Terms and Conditions</span>
//                     </span>
//                   </label>

//                   {/* Submit */}
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-[#043F79] rounded-[5px] mb-[12px] md:mb-[18px] text-white py-[10px] px-[20px] font-semibold text-[16px] md:text-[18px] hover:bg-[#002b6d] transition"
//                   >
//                     {loading ? "Registering..." : "REGISTER NOW"}
//                   </button>

//                   <p className="text-[14px] text-gray-600 text-center">
//                     Already have an account?{" "}
//                     <Link href="/auth/login" className="text-[#355DEF] underline ml-1 font-medium">
//                       Log in
//                     </Link>
//                   </p>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Register;




// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import intlTelInput from "intl-tel-input";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import Link from "next/link";
// import Image from "next/image";
// import { toast, Toaster } from "react-hot-toast";
// import type { IntlTelInputInstance } from "intl-tel-input";
// import { AiOutlineCheck } from "react-icons/ai";

// const Register = () => {
//   const phoneRef = useRef<HTMLInputElement | null>(null);
//   const itiInstanceRef = useRef<IntlTelInputInstance | null>(null);

//   const [title, setTitle] = useState("Mr");
//   const [firstname, setFirstname] = useState("");
//   const [lastname, setLastname] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [termsAccepted, setTermsAccepted] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   useEffect(() => {
//     if (phoneRef.current) {
//       const iti = intlTelInput(phoneRef.current, {
//         initialCountry: "in",
//         separateDialCode: true,
//         utilsScript:
//           "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.0/build/js/utils.js",
//       });

//       itiInstanceRef.current = iti;
//       iti.setNumber("");
//       return () => iti.destroy();
//     }
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!termsAccepted) {
//       toast.error("Please accept the terms and conditions.");
//       return;
//     }

//     let mobile = "";
//     let countryCode = "+91";

//     if (itiInstanceRef.current && phoneRef.current) {
//       const countryData = itiInstanceRef.current.getSelectedCountryData();
//       countryCode = countryData.dialCode ? "+" + countryData.dialCode : "+91";
//       mobile = phoneRef.current.value.trim();
//     }

//     if (!mobile) {
//       toast.error("Please enter your contact number.");
//       return;
//     }

//     setLoading(true);

//     try {
//       const res = await fetch("http://localhost:5000/api/auth/register", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           title,
//           firstname,
//           lastname,
//           email,
//           password,
//           mobile,
//           countryCode,
//           termsAccepted,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         toast.success("Registration successful!");
//         setTitle("Mr");
//         setFirstname("");
//         setLastname("");
//         setEmail("");
//         setPassword("");
//         setTermsAccepted(false);
//         itiInstanceRef.current?.setNumber("");
//       } else {
//         toast.error(data.message || "Registration failed");
//       }
//     } catch {
//       toast.error("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="w-full min-h-[115dvh] my-0 flex items-center md:bg-[url('/images/Register-screen-2.jpg')] bg-no-repeat bg-cover bg-center">
//       <Toaster position="top-right" reverseOrder={false} />

// <div className="container mx-auto px-[35px] md:px-[70px] py-8 md:py-12">
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

//           {/* LEFT SECTION */}
//           <div className="md:col-span-7 self-center">
//            <Image
//   src="/images/moneynow-logo2.png"
//   alt="Logo"
//   width={260}   // ⬅ increased
//   height={80}   // ⬅ keep ratio close
//   className="mb-6 md:mb-[25px] w-[250px] md:w-auto"
//   priority
// />

//             <h1 className="text-[32px] md:text-[32px] font-bold leading-[36px] md:leading-[52px] text-black mb-[18px] md:mb-[25px]">
//               Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
//               consectetur, adipisci velit
//             </h1>

//             <p className="text-[16px] md:text-[18px] font-inter mb-[20px] md:mb-[25px] leading-[30px]">
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit.
//             </p>

//             <ul className="space-y-3">
//   {Array(4).fill(0).map((_, i) => (
//     <li key={i} className="flex items-center gap-3">
      
//       {/* Blue round check with icon */}
//       <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-sm">
//         <AiOutlineCheck className="w-4 h-4" />
//       </span>

//       {/* Text */}
//       <p className="text-[16px] text-gray-700">
//         Sed congue dolor quis mi maximus fermentum
//       </p>

//     </li>
//   ))}
// </ul>
//           </div>

//           {/* RIGHT SECTION */}
//           <div className="md:col-span-5 ">
//             <div className="bg-white border rounded-[10px] px-2 border-gray-200 shadow-sm">

// <div className="border-b border-[#E8E8E8] text-center p-6 md:p-3 px-8 md:px-6">
//                 <h2 className="text-[22px] md:text-[26px] font-bold mb-1">
//                   Register User
//                 </h2>
//                 <p className="text-[14px]">Welcome! Please fill the details</p>
//               </div>

//               <div className="p-3 md:p-4">
//                 <form onSubmit={handleSubmit}>

//                   {/* Title */}
//                   <div className="flex items-center gap-3 mb-[12px] md:mb-[18px]">
//                     <label className="text-[14px] text-gray-700 whitespace-nowrap">
//                       Title<span className="text-red-500">*</span>
//                     </label>

//                     {["Mr", "Mrs"].map((t) => (
//                       <label
//                         key={t}
//                         className="flex items-center gap-2 text-gray-700 text-[14px]"
//                       >
//                         <input
//                           type="radio"
//                           name="title"
//                           checked={title === t}
//                           onChange={() => setTitle(t)}
//                           className="h-3 w-3"
//                         />
//                         {t}
//                       </label>
//                     ))}
//                   </div>

//                   {/* First & Last Name */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-[10px] md:mb-[14px]">
//                     <div>
//                       <label className="text-[14px] block mb-1">
//                         First Name<span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={firstname}
//                         onChange={(e) => setFirstname(e.target.value)}
//                         className="w-full h-[44px] border border-[#E8E8E8] px-3"
//                       />
//                     </div>

//                     <div>
//                       <label className="text-[14px] block mb-1">
//                         Last Name<span className="text-red-500">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={lastname}
//                         onChange={(e) => setLastname(e.target.value)}
//                         className="w-full h-[44px] border border-[#E8E8E8] px-3"
//                       />
//                     </div>
//                   </div>

//                   {/* Email */}
//                   <div className="mb-[10px] md:mb-[14px]">
//                     <label className="text-[14px] block mb-1">
//                       Email<span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="email"
//                       value={email}
//                       onChange={(e) => setEmail(e.target.value)}
//                       className="w-full h-[44px] border border-[#E8E8E8] px-3"
//                     />
//                   </div>

//                   {/* Contact Number */}
//                   <div className="mb-[10px] md:mb-[14px]">
//                     <label className="text-[14px] block mb-1">
//                       Contact Number<span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       ref={phoneRef}
//                       type="tel"
//                       className="w-full h-[44px] border border-[#E8E8E8] px-3"
//                     />
//                   </div>

//                   {/* Password */}
//                   <div className="mb-[10px] md:mb-[14px]">
//                     <label className="text-[14px] block mb-1">
//                       Password<span className="text-red-500">*</span>
//                     </label>

//                     <div className="relative">
//                       <input
//                         type={showPassword ? "text" : "password"}
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         className="w-full h-[44px] border border-[#E8E8E8] px-3 pr-10"
//                       />

//                       <span
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-3 cursor-pointer text-gray-500"
//                       >
//                         {showPassword ? (
//                           <AiOutlineEye />
//                         ) : (
//                           <AiOutlineEyeInvisible />
//                         )}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Terms */}
//                   <label className="flex items-center gap-2 text-[14px] mb-[12px]">
//                     <input
//                       type="checkbox"
//                       checked={termsAccepted}
//                       onChange={(e) => setTermsAccepted(e.target.checked)}
//                     />
//                     I agree to the{" "}
//                     <span className="text-[#355DEF] cursor-pointer">
//                       Terms and Conditions
//                     </span>
//                   </label>

//                   {/* Submit */}
//                   <button
//                     type="submit"
//                     disabled={loading}
//                     className="bg-[#043F79] px-[15px] rounded-[5px] text-white py-[10px] text-[16px] hover:bg-[#002b6d]"
//                   >
//                     {loading ? "Registering..." : "REGISTER NOW"}
//                   </button>

//                   <p className="text-[14px] mt-2">
//                     Already have an account?
//                     <Link
//                       href="/auth/login"
//                       className="text-[#355DEF] underline ml-1"
//                     >
//                       Log in
//                     </Link>
//                   </p>

//                 </form>
//               </div>

//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// };

// export default Register;



"use client";

import React, { useEffect, useRef, useState } from "react";
import intlTelInput from "intl-tel-input";
import { AiOutlineEye, AiOutlineEyeInvisible, AiOutlineCheck } from "react-icons/ai";
import Link from "next/link";
import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";
import type { IntlTelInputInstance } from "intl-tel-input";

const Register = () => {
  const phoneRef = useRef<HTMLInputElement | null>(null);
  const itiInstanceRef = useRef<IntlTelInputInstance | null>(null);

  const [title, setTitle] = useState("Mr");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation error messages
  const [errors, setErrors] = useState<{
    title?: string;
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    mobile?: string;
    terms?: string;
  }>({});

  useEffect(() => {
    if (phoneRef.current) {
      const iti = intlTelInput(phoneRef.current, {
        initialCountry: "in",
        separateDialCode: true,
        utilsScript:
          "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.0/build/js/utils.js",
      });
      itiInstanceRef.current = iti;
      iti.setNumber("");
      return () => iti.destroy();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let mobile = "";
    let countryCode = "+91";

    if (itiInstanceRef.current && phoneRef.current) {
      const countryData = itiInstanceRef.current.getSelectedCountryData();
      countryCode = countryData.dialCode ? "+" + countryData.dialCode : "+91";
      mobile = phoneRef.current.value.trim();
    }

    // Reset errors
    setErrors({});

    // Frontend validations
    const newErrors: typeof errors = {};
    if (!title || !["Mr", "Mrs"].includes(title)) newErrors.title = "Title must be Mr or Mrs";
    if (!firstname) newErrors.firstname = "First name is required";
    if (!lastname) newErrors.lastname = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) newErrors.email = "Invalid email format";
    if (!password) newErrors.password = "Password is required";
    else if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,128}$/.test(password))
      newErrors.password = "Password must be 8+ chars, include 1 uppercase, 1 number & 1 special character";
    if (!mobile) newErrors.mobile = "Mobile number is required";
    if (!termsAccepted) newErrors.terms = "Please accept the terms";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          firstname,
          lastname,
          email,
          password,
          mobile,
          countryCode,
          termsAccepted,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Registration successful!");
        // reset form
        setTitle("Mr");
        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
        setTermsAccepted(false);
        itiInstanceRef.current?.setNumber("");
        setErrors({});
      } else {
        // If backend sends validation message
        setErrors({ ...errors, email: data.message.includes("Email") ? data.message : undefined });
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full min-h-[118dvh] my-0 flex items-center md:bg-[url('/images/Register-screen-2.jpg')] bg-no-repeat bg-cover bg-center">
      <Toaster position="top-right" reverseOrder={false} />

<div className="container mx-auto px-4 sm:px-6 md:px-[70px] py-8 md:py-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

          {/* LEFT SECTION */}
          <div className="md:col-span-7 self-center">
            <Image
              src="/images/moneynow-logo2.png"
              alt="Logo"
              width={260}
              height={80}
              className="mb-4 md:mb-6 w-[250px] md:w-auto"
              priority
            />
            <h1 className="text-[26px] md:text-[32px] font-bold leading-[36px] md:leading-[48px] text-black mb-4 md:mb-6">
              Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit
            </h1>
            <p className="text-[16px] md:text-[18px] font-inter mb-4 md:mb-6 leading-[28px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
            <ul className="space-y-2">
              {Array(4).fill(0).map((_, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-sm">
                    <AiOutlineCheck className="w-3 h-3" />
                  </span>
                  <p className="text-[15px] text-gray-700">Sed congue dolor quis mi maximus fermentum</p>
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT SECTION */}
          <div className="md:col-span-5 px-0 sm:px-4 md:px-0">
              <div className="bg-white border rounded-[10px] border-gray-200 shadow-sm px-4 md:px-6 py-3 md:py-4">

              {/* Header */}
              <div className="border-b border-[#E8E8E8] text-center pb-4 md:pb-3">
                <h2 className="text-[22px] md:text-[24px] font-bold mb-1">Register User</h2>
                <p className="text-[13px]">Welcome! Please fill the details</p>
              </div>

              {/* Form */}
              <div className="pt-4 md:pt-5">
                <form onSubmit={handleSubmit}>

                  {/* Title */}
                  <div className="flex items-center gap-2 mb-2 md:mb-3">
                    <label className="text-[13px] text-gray-700 whitespace-nowrap">Title<span className="text-red-500">*</span></label>
                    {["Mr", "Mrs"].map((t) => (
                      <label key={t} className="flex items-center gap-2 text-gray-700 text-[13px]">
                        <input type="radio" name="title" checked={title === t} onChange={() => setTitle(t)} className="h-3 w-3" />
                        {t}
                      </label>
                    ))}
                  </div>
                  {errors.title && <p className="text-red-500 text-[12px] mb-2">{errors.title}</p>}

                  {/* First & Last Name */}
           <div className="grid grid-cols-1 gap-2 mb-2 md:mb-3">
  <div>
    <label className="text-[13px] block mb-1">
      First Name<span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      value={firstname}
      onChange={(e) => setFirstname(e.target.value)}
      className="w-full h-[38px] border border-[#E8E8E8] px-2"
    />
    {errors.firstname && <p className="text-red-500 text-[12px] mt-1">{errors.firstname}</p>}
  </div>

  <div>
    <label className="text-[13px] block mb-1">
      Last Name<span className="text-red-500">*</span>
    </label>
    <input
      type="text"
      value={lastname}
      onChange={(e) => setLastname(e.target.value)}
      className="w-full h-[38px] border border-[#E8E8E8] px-2"
    />
    {errors.lastname && <p className="text-red-500 text-[12px] mt-1">{errors.lastname}</p>}
  </div>
</div>


                  {/* Email */}
                  <div className="mb-2 md:mb-3">
                    <label className="text-[13px] block mb-1">Email<span className="text-red-500">*</span></label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-[38px] border border-[#E8E8E8] px-2" />
                    {errors.email && <p className="text-red-500 text-[12px] mt-1">{errors.email}</p>}
                  </div>

                  {/* Contact Number */}
                  <div className="mb-2 md:mb-3">
                    <label className="text-[13px] block mb-1">Contact Number<span className="text-red-500">*</span></label>
                    <input ref={phoneRef} type="tel" className="w-full h-[38px] border border-[#E8E8E8] px-2" />
                    {errors.mobile && <p className="text-red-500 text-[12px] mt-1">{errors.mobile}</p>}
                  </div>

                  {/* Password */}
                  <div className="mb-2 md:mb-3">
                    <label className="text-[13px] block mb-1">Password<span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-[38px] border border-[#E8E8E8] px-2 pr-9" />
                      <span onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 cursor-pointer text-gray-500 text-[16px]">
                        {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                      </span>
                    </div>
                    {errors.password && <p className="text-red-500 text-[12px] mt-1">{errors.password}</p>}
                  </div>

                  {/* Terms */}
                  <div className="mb-2 md:mb-3">
                    <label className="flex items-center gap-2 text-[13px]">
                      <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} />
                      I agree to the <span className="text-[#355DEF] cursor-pointer">Terms and Conditions</span>
                    </label>
                    {errors.terms && <p className="text-red-500 text-[12px] mt-1">{errors.terms}</p>}
                  </div>

                  {/* Submit */}
                  <button type="submit" disabled={loading} className="bg-[#043F79] px-[15px] rounded-[5px] text-white py-[8px] text-[15px] hover:bg-[#002b6d] ">
                    {loading ? "Registering..." : "REGISTER NOW"}
                  </button>

                  <p className="text-[13px] mt-3">
                    Already have an account?
                    <Link href="/auth/login" className="text-[#355DEF] underline ml-1">Log in</Link>
                  </p>

                </form>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Register;
