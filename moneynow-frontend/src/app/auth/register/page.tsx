// // "use client";

// // import React, { useEffect, useRef } from "react";
// // import intlTelInput from "intl-tel-input";
// // import { AiOutlineCheck, AiOutlineEyeInvisible } from "react-icons/ai";
// // import Link from "next/link";

// // const Register = () => {
// //   const phoneRef = useRef<HTMLInputElement | null>(null);

// //   useEffect(() => {
// //     if (phoneRef.current) {
// //       const iti = intlTelInput(phoneRef.current, {
// //         initialCountry: "in",
// //         separateDialCode: true,
// //         utilsScript:
// //           "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.0/build/js/utils.js",
// //       });
// //       return () => iti.destroy();
// //     }
// //   }, []);

// //   return (
// //  <section
// //   className="
// //     w-full
// //     my-0               /* default for mobile */
// //     bg-no-repeat bg-cover bg-center
// //     md:bg-[url('/images/register-bg-3.png')]
// //     bg-none
// //   "
// // >

// //       <div className="container mx-auto px-5 md:px-8 py-16">
// //         <div className="grid grid-cols-1 md:grid-cols-12 gap-10">

// //           {/* LEFT SECTION */}
// //           <div className="md:col-span-7 self-center px-2">
// //             <img
// //               src="/images/moneynow-logo2.png"
// //               className="mb-8 md:mb-[50px] w-[180px] md:w-auto"
// //             />

// //             <h1 className="text-[28px] md:text-[36px] font-bold leading-[40px] md:leading-[52px] text-black mb-[20px] md:mb-[40px]">
// //               Neque porro quisquam est qui dolorem ipsum quia dolor sit amet,
// //               consectetur, adipisci velit
// //             </h1>

// //             <p className="text-[16px] md:text-[18px] font-inter mb-[20px] md:mb-[30px] leading-[35px]">
// //               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
// //               viverra finibus eleifend. Integer nisi dolor, fringilla ac
// //               accumsan sit amet
// //             </p>
// // <ul className="space-y-4 text-[16px] md:text-[18px] font-inter">
// //   {[
// //     "Sed congue dolor quis mi maximus fermentum",
// //     "Sed congue dolor quis mi maximus fermentum",
// //     "Sed congue dolor quis mi maximus fermentum",
// //     "Sed congue dolor quis mi maximus fermentum",
// //   ].map((item, index) => (
// //     <li key={index} className="flex items-center gap-3">
      
// //       <span
// //         className="
// //           w-5 h-5          /* Mobile */
// //           md:w-6 md:h-6    /* Tablet */
// //           lg:w-9 lg:h-9    /* Desktop = 36px */
// //           flex items-center justify-center
// //           bg-[#0774DE]
// //           rounded-full
// //           shrink-0        /* Prevent shrinking on mobile */
// //         "
// //       >
// //         <AiOutlineCheck
// //           className="
// //             text-white
// //             text-[9px]       /* Mobile smaller */
// //             md:text-[12px]   /* Tablet */
// //             lg:text-[18px]   /* Desktop */
// //           "
// //         />
// //       </span>

// //       <span>{item}</span>
// //     </li>
// //   ))}
// // </ul>



// //           </div>

// //           {/* RIGHT SECTION */}
// //           <div className="md:col-span-5">
// //             <div className="bg-white border rounded-[10px] border-gray-200 shadow-sm">
// //               <div className="border-b border-[#E8E8E8] text-center p-6">
// //                 <h2 className="text-[26px] md:text-[32px] font-bold mb-1">
// //                   Register User
// //                 </h2>
// //                 <p className="text-[14px]">Welcome! Please fill the details</p>
// //               </div>

// //               <div className="p-6 md:p-8">
// //                 <form>
// //                   {/* Title */}
// //                   <div className="flex items-center gap-3 mb-[25px] md:mb-[30px]">
// //                     <label className="text-[16px] text-gray-700 whitespace-nowrap">
// //                       Title<span className="text-red-500">*</span>
// //                     </label>

// //                     {["Mr", "Mrs"].map((t) => (
// //                       <label
// //                         key={t}
// //                         className="flex items-center gap-2 text-gray-700 text-sm"
// //                       >
// //                         <input
// //                           type="radio"
// //                           name="title"
// //                           className="h-4 w-4 text-blue-600 focus:ring-blue-500"
// //                         />
// //                         {t}
// //                       </label>
// //                     ))}
// //                   </div>

// //                   {/* Name */}
// //                   <div className="mb-[25px] md:mb-[30px]">
// //                     <label className="text-[16px] block mb-2">
// //                       Name<span className="text-red-500">*</span>
// //                     </label>
// //                     <input
// //                       type="text"
// //                       className="w-full h-[48px] md:h-[50px] border border-[#E8E8E8] px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
// //                     />
// //                   </div>

// //                   {/* Email */}
// //                   <div className="mb-[25px] md:mb-[30px]">
// //                     <label className="text-[16px] block mb-2">
// //                       Email<span className="text-red-500">*</span>
// //                     </label>
// //                     <input
// //                       type="email"
// //                       className="w-full h-[48px] md:h-[50px] border border-[#E8E8E8] px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
// //                     />
// //                   </div>

// //                   {/* Phone */}
// //                   <div className="mb-[25px] md:mb-[30px]">
// //                     <label className="text-[16px] block mb-2">
// //                       Contact Number<span className="text-red-500">*</span>
// //                     </label>
// //                     <input
// //                       ref={phoneRef}
// //                       type="tel"
// //                       className="w-full h-[48px] md:h-[50px] border border-[#E8E8E8] px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
// //                     />
// //                   </div>

// //                   {/* Password */}
// //                   <div className="mb-[25px] md:mb-[30px]">
// //                     <label className="text-[16px] block mb-2">
// //                       Password<span className="text-red-500">*</span>
// //                     </label>
// //                     <div className="relative">
// //                       <input
// //                         type="password"
// //                         className="w-full h-[48px] md:h-[50px] border border-[#E8E8E8] px-3 pr-10 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
// //                       />
// //                       <AiOutlineEyeInvisible className="absolute right-3 top-3 md:top-4 text-gray-500 text-lg" />
// //                     </div>
// //                   </div>

// //                   {/* Terms */}
// //                   <label className="flex items-center mb-[25px] md:mb-[30px] gap-2 text-[14px] text-gray-700">
// //                     <input type="checkbox" className="h-4 w-4 border-[#0774DE]" />
// //                     <span>
// //                       I agree to the{" "}
// //                       <span className="text-[#355DEF] cursor-pointer">
// //                         Terms and Conditions
// //                       </span>
// //                     </span>
// //                   </label>

// //                   {/* Submit */}
// //                   <button
// //                     type="submit"
// //                     className=" bg-[#043F79] rounded-[5px] mb-[20px] md:mb-[28px] text-white py-[12px] px-[20px] font-semibold text-[16px] md:text-[18px] hover:bg-[#002b6d] transition"
// //                   >
// //                     REGISTER NOW
// //                   </button>

// //                   <p className="text-[14px] text-gray-600 ">
// //                     Already have an account?
// //                   <Link
// //   href="/auth/login"
// //   className="text-[#355DEF] underline ml-1 font-medium"
// // >
// //   Log in
// // </Link>

// //                   </p>
// //                 </form>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // };

// // export default Register;






// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import intlTelInput from "intl-tel-input";
// import { AiOutlineCheck, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import Link from "next/link";
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
//   const [message, setMessage] = useState("");
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

//       // Set a default number so getNumber() always returns a value
//       iti.setNumber("+91");

//       return () => iti.destroy();
//     }
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!termsAccepted) {
//       setMessage("Please accept the terms and conditions.");
//       return;
//     }

//     setLoading(true);
//     setMessage("");

//     const iti = itiInstanceRef.current;
//     let fullNumber = "";

//     if (iti) {
//       // Use getNumber(), fallback to input value if empty
//       fullNumber = iti.getNumber() || phoneRef.current?.value || "";
//     }

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
//           mobile: fullNumber,
//           termsAccepted,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage("Registration successful!");
//         setTitle("Mr");
//         setFirstname("");
//         setLastname("");
//         setEmail("");
//         setPassword("");
//         setTermsAccepted(false);
//         if (iti) iti.setNumber("+91"); // Reset phone input
//       } else {
//         setMessage(data.message || "Registration failed");
//       }
//     } catch (error) {
//       console.error(error);
//       setMessage("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <section className="w-full my-0 md:bg-[url('/images/register-bg-3.png')] bg-no-repeat bg-cover bg-center">
//       <div className="container mx-auto px-5 md:px-8 py-18">
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
//           {/* LEFT SECTION */}
//           <div className="md:col-span-7 self-center ">
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
//             <ul className="space-y-4 text-[16px] md:text-[18px] font-inter">
//               {[
//                 "Sed congue dolor quis mi maximus fermentum",
//                 "Sed congue dolor quis mi maximus fermentum",
//                 "Sed congue dolor quis mi maximus fermentum",
//                 "Sed congue dolor quis mi maximus fermentum",
//               ].map((item, index) => (
//                 <li key={index} className="flex items-center gap-3">
//                   <span className="w-5 h-5 md:w-6 md:h-6 lg:w-9 lg:h-9 flex items-center justify-center bg-[#0774DE] rounded-full shrink-0">
//                     <AiOutlineCheck className="text-white text-[9px] md:text-[12px] lg:text-[18px]" />
//                   </span>
//                   <span>{item}</span>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* RIGHT SECTION */}
//          <div className="md:col-span-5">
//   <div className="bg-white border rounded-[10px] border-gray-200 shadow-sm">
//     <div className="border-b border-[#E8E8E8] text-center p-4 md:p-6">
//       <h2 className="text-[26px] md:text-[32px] font-bold mb-1">Register User</h2>
//       <p className="text-[14px]">Welcome! Please fill the details</p>
//     </div>

//     <div className="p-4 md:p-6">
//       <form onSubmit={handleSubmit}>
//         {/* Title */}
//         <div className="flex items-center gap-3 mb-[12px] md:mb-[18px]">
//           <label className="text-[16px] text-gray-700 whitespace-nowrap">
//             Title<span className="text-red-500">*</span>
//           </label>
//           {["Mr", "Mrs"].map((t) => (
//             <label key={t} className="flex items-center gap-2 text-gray-700 text-sm">
//               <input
//                 type="radio"
//                 name="title"
//                 value={t}
//                 checked={title === t}
//                 onChange={() => setTitle(t)}
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500"
//               />
//               {t}
//             </label>
//           ))}
//         </div>

//         {/* First Name */}
//         <div className="mb-[12px] md:mb-[18px]">
//           <label className="text-[16px] block mb-1">
//             First Name<span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             value={firstname}
//             onChange={(e) => setFirstname(e.target.value)}
//             className="w-full h-[46px] md:h-[48px] border border-[#E8E8E8] px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>

//         {/* Last Name */}
//         <div className="mb-[12px] md:mb-[18px]">
//           <label className="text-[16px] block mb-1">
//             Last Name<span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             value={lastname}
//             onChange={(e) => setLastname(e.target.value)}
//             className="w-full h-[46px] md:h-[48px] border border-[#E8E8E8] px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>

//         {/* Email */}
//         <div className="mb-[12px] md:mb-[18px]">
//           <label className="text-[16px] block mb-1">
//             Email<span className="text-red-500">*</span>
//           </label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full h-[46px] md:h-[48px] border border-[#E8E8E8] px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>

//         {/* Phone */}
//         <div className="mb-[12px] md:mb-[18px]">
//           <label className="text-[16px] block mb-1">
//             Contact Number<span className="text-red-500">*</span>
//           </label>
//           <input
//             ref={phoneRef}
//             type="tel"
//             className="w-full h-[46px] md:h-[48px] border border-[#E8E8E8] px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>

//         {/* Password */}
//         <div className="mb-[12px] md:mb-[18px]">
//           <label className="text-[16px] block mb-1">
//             Password<span className="text-red-500">*</span>
//           </label>
//           <div className="relative">
//             <input
//               type={showPassword ? "text" : "password"}
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="w-full h-[46px] md:h-[48px] border border-[#E8E8E8] px-3 pr-10 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
//             />
//             <span
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute right-3 top-3 md:top-3.5 text-gray-500 text-lg cursor-pointer"
//             >
//               {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
//             </span>
//           </div>
//         </div>

//         {/* Terms */}
//         <label className="flex items-center mb-[12px] md:mb-[18px] gap-2 text-[14px] text-gray-700">
//           <input
//             type="checkbox"
//             checked={termsAccepted}
//             onChange={(e) => setTermsAccepted(e.target.checked)}
//             className="h-4 w-4 border-[#0774DE]"
//           />
//           <span>
//             I agree to the{" "}
//             <span className="text-[#355DEF] cursor-pointer">Terms and Conditions</span>
//           </span>
//         </label>

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-[#043F79] rounded-[5px] mb-[12px] md:mb-[18px] text-white py-[10px] px-[20px] font-semibold text-[16px] md:text-[18px] hover:bg-[#002b6d] transition "
//         >
//           {loading ? "Registering..." : "REGISTER NOW"}
//         </button>

//         {message && <p className="text-center text-red-500 mb-2">{message}</p>}

//         <p className="text-[14px] text-gray-600 text-center">
//           Already have an account?
//           <Link href="/auth/login" className="text-[#355DEF] underline ml-1 font-medium">
//             Log in
//           </Link>
//         </p>
//       </form>
//     </div>
//   </div>
// </div>

          
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Register;




// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import intlTelInput from "intl-tel-input";
// import { AiOutlineCheck, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
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
//       iti.setNumber("+91"); // default number
//       return () => iti.destroy();
//     }
//   }, []);

// const handleSubmit = async (e: React.FormEvent) => {
//   e.preventDefault();

//   if (!termsAccepted) {
//     toast.error("Please accept the terms and conditions.");
//     return;
//   }

//   setLoading(true);

//   const iti = itiInstanceRef.current;
//   let fullNumber = "";

 
  
//   if (iti && phoneRef.current) {
//   const countryData = iti.getSelectedCountryData();
//   const dialCode = countryData.dialCode || "91"; // Fallback to India
//   const rawNumber = phoneRef.current.value.trim();
  
//   if (rawNumber) {
//     fullNumber = dialCode + " " + rawNumber; // e.g., "91 8796013082"
//   }
// }

//   try {
//     const res = await fetch("http://localhost:5000/api/auth/register", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         title,
//         firstname,
//         lastname,
//         email,
//         password,
//         mobile: fullNumber, // now includes country code, no +
//         termsAccepted,
//       }),
//     });

//     const data = await res.json();

//     if (res.ok) {
//       toast.success("Registration successful!");
//       setTitle("Mr");
//       setFirstname("");
//       setLastname("");
//       setEmail("");
//       setPassword("");
//       setTermsAccepted(false);
//       if (iti) iti.setNumber("+91"); // reset input
//     } else {
//       toast.error(data.message || "Registration failed");
//     }
//   } catch (error) {
//     console.error(error);
//     toast.error("Something went wrong. Please try again.");
//   } finally {
//     setLoading(false);
//   }
// };


//   return (
//     <section className="w-full my-0 md:bg-[url('/images/register-bg-3.png')] bg-no-repeat bg-cover bg-center">
//       <Toaster position="top-right" reverseOrder={false} />
//       <div className="container mx-auto px-5 md:px-8 py-18">
//         <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
//           {/* LEFT SECTION */}
//           <div className="md:col-span-7 self-center ">
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
//                     className="bg-[#043F79] rounded-[5px] mb-[12px] md:mb-[18px] text-white py-[10px] px-[20px] font-semibold text-[16px] md:text-[18px] hover:bg-[#002b6d] transition "
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

"use client";

import React, { useEffect, useRef, useState } from "react";
import intlTelInput from "intl-tel-input";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Link from "next/link";
import { toast, Toaster } from "react-hot-toast";
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
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (phoneRef.current) {
      const iti = intlTelInput(phoneRef.current, {
        initialCountry: "in",
        separateDialCode: true,
        utilsScript:
          "https://cdn.jsdelivr.net/npm/intl-tel-input@18.2.0/build/js/utils.js",
      });

      itiInstanceRef.current = iti;
      iti.setNumber(""); // leave input empty initially
      return () => iti.destroy();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsAccepted) {
      toast.error("Please accept the terms and conditions.");
      return;
    }

    let mobile = "";
    let countryCode = "+91"; // default country code

    if (itiInstanceRef.current && phoneRef.current) {
      const iti = itiInstanceRef.current;
      const countryData = iti.getSelectedCountryData();
      countryCode = countryData.dialCode ? "+" + countryData.dialCode : "+91"; // fallback
      mobile = phoneRef.current.value.trim();
    }

    if (!mobile) {
      toast.error("Please enter your contact number.");
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
        // Reset form
        setTitle("Mr");
        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
        setTermsAccepted(false);
        if (itiInstanceRef.current) itiInstanceRef.current.setNumber(""); // reset phone input
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full my-0 md:bg-[url('/images/register-bg-3.png')] bg-no-repeat bg-cover bg-center">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="container mx-auto px-5 md:px-8 py-18">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* LEFT SECTION */}
          <div className="md:col-span-7 self-center">
            <img
              src="/images/moneynow-logo2.png"
              className="mb-8 md:mb-[50px] w-[180px] md:w-auto"
            />
            <h1 className="text-[28px] md:text-[36px] font-bold leading-[40px] md:leading-[52px] text-black mb-[20px] md:mb-[40px]">
              Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit
            </h1>
            <p className="text-[16px] md:text-[18px] font-inter mb-[20px] md:mb-[30px] leading-[35px]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>
          </div>

          {/* RIGHT SECTION */}
          <div className="md:col-span-5">
            <div className="bg-white border rounded-[10px] border-gray-200 shadow-sm">
              <div className="border-b border-[#E8E8E8] text-center p-4 md:p-6">
                <h2 className="text-[26px] md:text-[32px] font-bold mb-1">Register User</h2>
                <p className="text-[14px]">Welcome! Please fill the details</p>
              </div>

              <div className="p-4 md:p-6">
                <form onSubmit={handleSubmit}>
                  {/* Title */}
                  <div className="flex items-center gap-3 mb-[12px] md:mb-[18px]">
                    <label className="text-[16px] text-gray-700 whitespace-nowrap">
                      Title<span className="text-red-500">*</span>
                    </label>
                    {["Mr", "Mrs"].map((t) => (
                      <label key={t} className="flex items-center gap-2 text-gray-700 text-sm">
                        <input
                          type="radio"
                          name="title"
                          value={t}
                          checked={title === t}
                          onChange={() => setTitle(t)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        {t}
                      </label>
                    ))}
                  </div>

                  {/* First Name */}
                  <div className="mb-[12px] md:mb-[18px]">
                    <label className="text-[16px] block mb-1">
                      First Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={firstname}
                      onChange={(e) => setFirstname(e.target.value)}
                      className="w-full h-[46px] md:h-[48px] border border-[#E8E8E8] px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="mb-[12px] md:mb-[18px]">
                    <label className="text-[16px] block mb-1">
                      Last Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={lastname}
                      onChange={(e) => setLastname(e.target.value)}
                      className="w-full h-[46px] md:h-[48px] border border-[#E8E8E8] px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-[12px] md:mb-[18px]">
                    <label className="text-[16px] block mb-1">
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-[46px] md:h-[48px] border border-[#E8E8E8] px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Phone */}
                  <div className="mb-[12px] md:mb-[18px]">
                    <label className="text-[16px] block mb-1">
                      Contact Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      ref={phoneRef}
                      type="tel"
                      className="w-full h-[46px] md:h-[48px] border border-[#E8E8E8] px-3 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-[12px] md:mb-[18px]">
                    <label className="text-[16px] block mb-1">
                      Password<span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-[46px] md:h-[48px] border border-[#E8E8E8] px-3 pr-10 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <span
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 md:top-3.5 text-gray-500 text-lg cursor-pointer"
                      >
                        {showPassword ? <AiOutlineEye /> : <AiOutlineEyeInvisible />}
                      </span>
                    </div>
                  </div>

                  {/* Terms */}
                  <label className="flex items-center mb-[12px] md:mb-[18px] gap-2 text-[14px] text-gray-700">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="h-4 w-4 border-[#0774DE]"
                    />
                    <span>
                      I agree to the{" "}
                      <span className="text-[#355DEF] cursor-pointer">Terms and Conditions</span>
                    </span>
                  </label>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#043F79] rounded-[5px] mb-[12px] md:mb-[18px] text-white py-[10px] px-[20px] font-semibold text-[16px] md:text-[18px] hover:bg-[#002b6d] transition"
                  >
                    {loading ? "Registering..." : "REGISTER NOW"}
                  </button>

                  <p className="text-[14px] text-gray-600 text-center">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-[#355DEF] underline ml-1 font-medium">
                      Log in
                    </Link>
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
