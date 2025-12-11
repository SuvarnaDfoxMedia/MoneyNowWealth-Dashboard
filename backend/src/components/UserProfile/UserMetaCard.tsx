<<<<<<< HEAD


=======
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
// import { useState, useEffect } from "react";
// import { useModal } from "../../hooks/useModal";
// import { Modal } from "../ui/modal";
// import Button from "../ui/button/Button";
// import Input from "../form/input/InputField";
// import Label from "../form/Label";
// import axios from "axios";
// import toast from "react-hot-toast";
<<<<<<< HEAD
// import { useAuth } from "../../context/AuthContext";

// export default function UserMetaCard() {
//   const { isOpen, openModal, closeModal } = useModal();
//   const { user, refreshUser } = useAuth();

//   const [formData, setFormData] = useState({ firstname: "", lastname: "", phone: "", address: "" });
//   const [profileImage, setProfileImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const backendUrl = import.meta.env.VITE_API_BASE;

//   // Load existing user data
=======
// import { useUser } from "../../context/UserContext";

// export default function UserMetaCard() {
//   const { isOpen, openModal, closeModal } = useModal();
//   const { user, refreshUser } = useUser();
//   const [formData, setFormData] = useState({ firstname: "", lastname: "", phone: "", address: "" });
//   const [profileImage, setProfileImage] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
//   const resetForm = () => {
//     if (user) {
//       const [first, ...rest] = user.name?.split(" ") || [];
//       setFormData({
//         firstname: first || "",
//         lastname: rest.join(" ") || "",
//         phone: user.phone || "",
//         address: user.address || "",
//       });
//       setProfileImage(null);
//       setImagePreview(user?.profileImage ? `${backendUrl}${user.profileImage}?v=${Date.now()}` : null);
//       setErrors({});
//     }
//   };

//   useEffect(() => {
//     resetForm();
//   }, [user]);

<<<<<<< HEAD
//   // Handle profile image upload
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setErrors((prev) => ({ ...prev, profileImage: "" }));
=======
//   const handleImageChange = (e) => {
//     setErrors((prev) => ({ ...prev, profileImage: null }));
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       if (!file.type.startsWith("image/")) {
//         setErrors((prev) => ({ ...prev, profileImage: "Only image files are allowed!" }));
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setErrors((prev) => ({ ...prev, profileImage: "File size cannot exceed 5MB!" }));
//         return;
//       }
//       setProfileImage(file);
//       const reader = new FileReader();
<<<<<<< HEAD
//       reader.onload = () => setImagePreview(reader.result as string);
=======
//       reader.onload = () => setImagePreview(reader.result);
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
//       reader.readAsDataURL(file);
//     }
//   };

//   // Handle form submit
<<<<<<< HEAD
//   const handleSave = async (e: React.FormEvent) => {
=======
//   const handleSave = async (e) => {
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
//     e.preventDefault();
//     setLoading(true);
//     setErrors({});

<<<<<<< HEAD
//     const newErrors: Record<string, string> = {};
=======
//     const newErrors = {};
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
//     if (!formData.firstname.trim()) newErrors.firstname = "First Name is required";
//     if (!formData.lastname.trim()) newErrors.lastname = "Last Name is required";
//     if (!formData.phone.trim()) newErrors.phone = "Phone is required";
//     if (formData.phone.trim() && formData.phone.trim().length < 10)
//       newErrors.phone = "Phone must be at least 10 characters";
//     if (!formData.address.trim()) newErrors.address = "Address is required";

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setLoading(false);
//       return;
//     }

//     try {
//       const submitData = new FormData();
//       submitData.append("name", `${formData.firstname} ${formData.lastname}`);
//       submitData.append("phone", formData.phone);
//       submitData.append("address", formData.address);
//       if (profileImage) submitData.append("profileImage", profileImage);

<<<<<<< HEAD
//       const res = await axios.put(`${backendUrl}/auth/profile`, submitData, {
=======
//       const res = await axios.put(`${backendUrl}/api/profile`, submitData, {
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" },
//       });

<<<<<<< HEAD
//       await refreshUser(); // AuthContext's refreshUser
//       toast.success(res.data.message || "Profile updated successfully!");
//       closeModal();
//     } catch (err: any) {
//       if (err.response?.data?.errors) {
//         const fieldErrors: Record<string, string> = {};
//         err.response.data.errors.forEach((e: any) => {
=======
//       await refreshUser();
//       toast.success(res.data.message || "Profile updated successfully!");
//       closeModal();
//     } catch (err) {
//       if (err.response?.data?.errors) {
//         const fieldErrors = {};
//         err.response.data.errors.forEach((e) => {
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
//           if (e.param === "name") {
//             fieldErrors.firstname = e.msg;
//             fieldErrors.lastname = e.msg;
//           }
//           if (e.param === "phone") fieldErrors.phone = e.msg;
//           if (e.param === "address") fieldErrors.address = e.msg;
//         });
//         setErrors(fieldErrors);
//       } else if (err.response?.data?.message) {
//         toast.error(err.response.data.message);
//       } else {
//         toast.error("Failed to update profile.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

<<<<<<< HEAD
//   const inputClass = (field: string) =>
=======
//   const inputClass = (field) =>
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
//     `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
//       errors[field]
//         ? "border-red-500 ring-red-500 dark:border-red-500"
//         : "border-gray-300 dark:border-gray-700 ring-blue-500 dark:bg-gray-800"
//     }`;

//   return (
//     <>
<<<<<<< HEAD
//       {/* User Card */}
=======
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
//       <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
//         <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
//           <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
//             <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
//               <img
//                 src={
//                   imagePreview ||
//                   (user?.profileImage ? `${backendUrl}${user.profileImage}` : "/images/user/owner.jpg")
//                 }
//                 alt="Profile"
//                 className="object-cover w-full h-full"
//               />
//             </div>
<<<<<<< HEAD

//             {/* Name + Phone + Address in one row on xl screens */}
=======
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
//             <div className="order-3 xl:order-2">
//               <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
//                 {`${formData.firstname} ${formData.lastname}`}
//               </h4>
//               <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
//                 {user?.phone && (
//                   <>
//                     <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</p>
//                   </>
//                 )}
//                 {user?.address && (
//                   <>
//                     <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">{user.address}</p>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={openModal}
//             className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
//           >
//             Edit
//           </button>
//         </div>
//       </div>

<<<<<<< HEAD
//       {/* Modal */}
=======
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
//       <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
//         <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
//           <div className="px-2 pr-14">
//             <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
//               Edit Personal Information
//             </h4>
//             <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
//               Update your details to keep your profile up-to-date.
//             </p>
//           </div>

//           <form onSubmit={handleSave} className="flex flex-col">
//             <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
<<<<<<< HEAD
//               {/* Profile Image */}
=======
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
//               <div className="mt-7">
//                 <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
//                   Profile Image
//                 </h5>
//                 <div className="flex items-center gap-6 mb-6">
//                   <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
//                     <img
//                       src={
//                         imagePreview ||
//                         (user?.profileImage ? `${backendUrl}${user.profileImage}` : "/images/user/owner.jpg")
//                       }
//                       alt="Profile preview"
//                       className="object-cover w-full h-full"
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <Label htmlFor="profileImage">Upload New Image</Label>
//                     <input
//                       id="profileImage"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className={inputClass("profileImage")}
//                     />
//                     {errors.profileImage && <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>}
//                     <p className="mt-1 text-xs text-gray-500">JPG, PNG or GIF (Max 5MB)</p>
//                   </div>
//                 </div>
//               </div>

<<<<<<< HEAD
//               {/* Personal Info */}
=======
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
//               <div className="mt-7">
//                 <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
//                   Personal Information
//                 </h5>

//                 <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
//                   <div>
//                     <Label htmlFor="firstname">First Name</Label>
//                     <Input
//                       id="firstname"
//                       name="firstname"
//                       type="text"
//                       value={formData.firstname}
//                       onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
//                       placeholder="Enter your first name"
//                       className={inputClass("firstname")}
//                     />
//                     {errors.firstname && <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>}
//                   </div>

//                   <div>
//                     <Label htmlFor="lastname">Last Name</Label>
//                     <Input
//                       id="lastname"
//                       name="lastname"
//                       type="text"
//                       value={formData.lastname}
//                       onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
//                       placeholder="Enter your last name"
//                       className={inputClass("lastname")}
//                     />
//                     {errors.lastname && <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>}
//                   </div>

//                   <div>
//                     <Label htmlFor="phone">Phone</Label>
//                     <Input
//                       id="phone"
//                       name="phone"
//                       type="text"
//                       value={formData.phone}
//                       onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
//                       placeholder="Enter your phone number"
//                       className={inputClass("phone")}
//                     />
//                     {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
//                   </div>

//                   <div className="col-span-2">
//                     <Label htmlFor="address">Address</Label>
//                     <textarea
//                       id="address"
//                       name="address"
//                       value={formData.address}
//                       onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                       placeholder="Enter your address"
//                       rows={3}
//                       className={inputClass("address")}
//                     />
//                     {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
//                   </div>
//                 </div>
//               </div>
//             </div>

<<<<<<< HEAD
//             {/* Buttons */}
//             <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
//               <Button type="button" onClick={resetForm} disabled={loading}>
//                 Reset
//               </Button>
//               <Button type="submit" disabled={loading}>
//                 {loading ? "Saving..." : "Save Changes"}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </Modal>
//     </>
//   );
// }



// import { useState, useEffect } from "react";
// import { useModal } from "../../hooks/useModal";
// import { Modal } from "../ui/modal";
// import Button from "../ui/button/Button";
// import Input from "../form/input/InputField";
// import Label from "../form/Label";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { useAuth } from "../../context/AuthContext";

// interface FormData {
//   firstname: string;
//   lastname: string;
//   phone: string;
//   address: string;
// }

// export default function UserMetaCard() {
//   const { isOpen, openModal, closeModal } = useModal();
//   const { user, refreshUser } = useAuth();

//   const [formData, setFormData] = useState<FormData>({
//     firstname: "",
//     lastname: "",
//     phone: "",
//     address: "",
//   });
//   const [profileImage, setProfileImage] = useState<File | null>(null);
//   const [imagePreview, setImagePreview] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   const backendUrl = import.meta.env.VITE_API_BASE;

//   // Reset form with user data
//   const resetForm = () => {
//     if (user) {
//       setFormData({
//         firstname: user.firstname || "",
//         lastname: user.lastname || "",
//         phone: user.phone || "",
//         address: user.address || "",
//       });
//       setProfileImage(null);
//       setImagePreview(
//         user.profileImage ? `${backendUrl}${user.profileImage}?v=${Date.now()}` : null
//       );
//       setErrors({});
//     }
//   };

//   useEffect(() => {
//     resetForm();
//   }, [user]);

//   // Profile image change
//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setErrors((prev) => ({ ...prev, profileImage: "" }));
//     if (e.target.files?.[0]) {
//       const file = e.target.files[0];
//       if (!file.type.startsWith("image/")) {
//         setErrors((prev) => ({ ...prev, profileImage: "Only image files are allowed!" }));
//         return;
//       }
//       if (file.size > 5 * 1024 * 1024) {
//         setErrors((prev) => ({ ...prev, profileImage: "File size cannot exceed 5MB!" }));
//         return;
//       }
//       setProfileImage(file);
//       const reader = new FileReader();
//       reader.onload = () => setImagePreview(reader.result as string);
//       reader.readAsDataURL(file);
//     }
//   };

//   // Submit form
//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setErrors({});

//     const newErrors: Record<string, string> = {};
//     if (!formData.firstname.trim()) newErrors.firstname = "First Name is required";
//     if (!formData.lastname.trim()) newErrors.lastname = "Last Name is required";
//     if (!formData.phone.trim()) newErrors.phone = "Phone is required";
//     if (formData.phone.trim() && formData.phone.trim().length < 10)
//       newErrors.phone = "Phone must be at least 10 characters";
//     if (!formData.address.trim()) newErrors.address = "Address is required";

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       setLoading(false);
//       return;
//     }

//     try {
//       const submitData = new FormData();
//       submitData.append("name", `${formData.firstname} ${formData.lastname}`);
//       submitData.append("phone", formData.phone);
//       submitData.append("address", formData.address);
//       if (profileImage) submitData.append("profileImage", profileImage);

//       const res = await axios.put(`${backendUrl}/profile`, submitData, {
//         withCredentials: true,
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       // Refresh user context
//       await refreshUser();

//       toast.success(res.data.message || "Profile updated successfully!");

//       // Update preview immediately if image changed
//       if (profileImage && res.data.user.profileImage) {
//         setImagePreview(`${backendUrl}${res.data.user.profileImage}?v=${Date.now()}`);
//       }

//       closeModal();
//     } catch (err: any) {
//       if (err.response?.data?.errors) {
//         const fieldErrors: Record<string, string> = {};
//         err.response.data.errors.forEach((e: any) => {
//           if (e.param === "name") {
//             fieldErrors.firstname = e.msg;
//             fieldErrors.lastname = e.msg;
//           }
//           if (e.param === "phone") fieldErrors.phone = e.msg;
//           if (e.param === "address") fieldErrors.address = e.msg;
//         });
//         setErrors(fieldErrors);
//       } else if (err.response?.data?.message) {
//         toast.error(err.response.data.message);
//       } else {
//         toast.error("Failed to update profile.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const inputClass = (field: string) =>
//     `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
//       errors[field]
//         ? "border-red-500 ring-red-500 dark:border-red-500"
//         : "border-gray-300 dark:border-gray-700 ring-blue-500 dark:bg-gray-800"
//     }`;

//   return (
//     <>
//       {/* User Card */}
//       <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
//         <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
//           <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
//             <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
//               <img
//                 src={imagePreview || "/images/user/owner.jpg"}
//                 alt="Profile"
//                 className="object-cover w-full h-full"
//               />
//             </div>

//             <div className="order-3 xl:order-2">
//               <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
//                 {`${formData.firstname} ${formData.lastname}`}
//               </h4>
//               <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
//                 {formData.phone && (
//                   <>
//                     <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">{formData.phone}</p>
//                   </>
//                 )}
//                 {formData.address && (
//                   <>
//                     <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
//                     <p className="text-sm text-gray-500 dark:text-gray-400">{formData.address}</p>
//                   </>
//                 )}
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={openModal}
//             className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
//           >
//             Edit
//           </button>
//         </div>
//       </div>

//       {/* Modal */}
//       <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
//         <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
//           <div className="px-2 pr-14">
//             <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
//               Edit Personal Information
//             </h4>
//             <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
//               Update your details to keep your profile up-to-date.
//             </p>
//           </div>

//           <form onSubmit={handleSave} className="flex flex-col">
//             <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
//               {/* Profile Image */}
//               <div className="mt-7">
//                 <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
//                   Profile Image
//                 </h5>
//                 <div className="flex items-center gap-6 mb-6">
//                   <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
//                     <img
//                       src={imagePreview || "/images/user/owner.jpg"}
//                       alt="Profile preview"
//                       className="object-cover w-full h-full"
//                     />
//                   </div>
//                   <div className="flex-1">
//                     <Label htmlFor="profileImage">Upload New Image</Label>
//                     <input
//                       id="profileImage"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className={inputClass("profileImage")}
//                     />
//                     {errors.profileImage && (
//                       <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>
//                     )}
//                     <p className="mt-1 text-xs text-gray-500">JPG, PNG or GIF (Max 5MB)</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Personal Info */}
//               <div className="mt-7">
//                 <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
//                   Personal Information
//                 </h5>

//                 <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
//                   <div>
//                     <Label htmlFor="firstname">First Name</Label>
//                     <Input
//                       id="firstname"
//                       name="firstname"
//                       type="text"
//                       value={formData.firstname}
//                       onChange={(e) =>
//                         setFormData({ ...formData, firstname: e.target.value })
//                       }
//                       placeholder="Enter your first name"
//                       className={inputClass("firstname")}
//                     />
//                     {errors.firstname && (
//                       <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>
//                     )}
//                   </div>

//                   <div>
//                     <Label htmlFor="lastname">Last Name</Label>
//                     <Input
//                       id="lastname"
//                       name="lastname"
//                       type="text"
//                       value={formData.lastname}
//                       onChange={(e) =>
//                         setFormData({ ...formData, lastname: e.target.value })
//                       }
//                       placeholder="Enter your last name"
//                       className={inputClass("lastname")}
//                     />
//                     {errors.lastname && (
//                       <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>
//                     )}
//                   </div>

//                   <div>
//                     <Label htmlFor="phone">Phone</Label>
//                     <Input
//                       id="phone"
//                       name="phone"
//                       type="text"
//                       value={formData.phone}
//                       onChange={(e) =>
//                         setFormData({ ...formData, phone: e.target.value })
//                       }
//                       placeholder="Enter your phone number"
//                       className={inputClass("phone")}
//                     />
//                     {errors.phone && (
//                       <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
//                     )}
//                   </div>

//                   <div className="col-span-2">
//                     <Label htmlFor="address">Address</Label>
//                     <textarea
//                       id="address"
//                       name="address"
//                       value={formData.address}
//                       onChange={(e) =>
//                         setFormData({ ...formData, address: e.target.value })
//                       }
//                       placeholder="Enter your address"
//                       rows={3}
//                       className={inputClass("address")}
//                     />
//                     {errors.address && (
//                       <p className="mt-1 text-sm text-red-600">{errors.address}</p>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Buttons */}
=======
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
//             <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
//               <Button type="button" onClick={resetForm} disabled={loading}>
//                 Reset
//               </Button>
//               <Button type="submit" disabled={loading}>
//                 {loading ? "Saving..." : "Save Changes"}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </Modal>
//     </>
//   );
// }


import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import axios from "axios";
import toast from "react-hot-toast";
<<<<<<< HEAD
import { useAuth, User } from "../../context/AuthContext";

interface FormData {
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
}
=======
import { useAuth } from "../../context/AuthContext";
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user, refreshUser } = useAuth();

<<<<<<< HEAD
  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    phone: "",
    address: "",
  });
=======
  const [formData, setFormData] = useState({ firstname: "", lastname: "", phone: "", address: "" });
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

<<<<<<< HEAD
  const backendUrl = import.meta.env.VITE_API_BASE;

  const resetForm = () => {
    if (user) {
      setFormData({
        firstname: user.firstname || "",
        lastname: user.lastname || "",
=======
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Load existing user data
  const resetForm = () => {
    if (user) {
      const [first, ...rest] = user.name?.split(" ") || [];
      setFormData({
        firstname: first || "",
        lastname: rest.join(" ") || "",
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
        phone: user.phone || "",
        address: user.address || "",
      });
      setProfileImage(null);
<<<<<<< HEAD
      setImagePreview(
        user.profileImage ? `${backendUrl}${user.profileImage}?v=${Date.now()}` : null
      );
=======
      setImagePreview(user?.profileImage ? `${backendUrl}${user.profileImage}?v=${Date.now()}` : null);
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
      setErrors({});
    }
  };

  useEffect(() => {
    resetForm();
  }, [user]);

<<<<<<< HEAD
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors((prev) => ({ ...prev, profileImage: "" }));
    if (e.target.files?.[0]) {
=======
  // Handle profile image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrors((prev) => ({ ...prev, profileImage: "" }));
    if (e.target.files && e.target.files[0]) {
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, profileImage: "Only image files are allowed!" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profileImage: "File size cannot exceed 5MB!" }));
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

<<<<<<< HEAD
=======
  // Handle form submit
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.firstname.trim()) newErrors.firstname = "First Name is required";
    if (!formData.lastname.trim()) newErrors.lastname = "Last Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (formData.phone.trim() && formData.phone.trim().length < 10)
      newErrors.phone = "Phone must be at least 10 characters";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("name", `${formData.firstname} ${formData.lastname}`);
      submitData.append("phone", formData.phone);
      submitData.append("address", formData.address);
      if (profileImage) submitData.append("profileImage", profileImage);

<<<<<<< HEAD
      const res = await axios.put(`${backendUrl}/profile`, submitData, {
=======
      const res = await axios.put(`${backendUrl}/api/profile`, submitData, {
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

<<<<<<< HEAD
      await refreshUser();

      toast.success(res.data.message || "Profile updated successfully!");

      if (profileImage && res.data.user.profileImage) {
        setImagePreview(`${backendUrl}${res.data.user.profileImage}?v=${Date.now()}`);
      }

=======
      await refreshUser(); // AuthContext's refreshUser
      toast.success(res.data.message || "Profile updated successfully!");
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
      closeModal();
    } catch (err: any) {
      if (err.response?.data?.errors) {
        const fieldErrors: Record<string, string> = {};
        err.response.data.errors.forEach((e: any) => {
          if (e.param === "name") {
            fieldErrors.firstname = e.msg;
            fieldErrors.lastname = e.msg;
          }
          if (e.param === "phone") fieldErrors.phone = e.msg;
          if (e.param === "address") fieldErrors.address = e.msg;
        });
        setErrors(fieldErrors);
      } else if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Failed to update profile.");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-500 ring-red-500 dark:border-red-500"
        : "border-gray-300 dark:border-gray-700 ring-blue-500 dark:bg-gray-800"
    }`;

  return (
    <>
      {/* User Card */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img
<<<<<<< HEAD
                src={imagePreview || "/images/user/owner.jpg"}
=======
                src={
                  imagePreview ||
                  (user?.profileImage ? `${backendUrl}${user.profileImage}` : "/images/user/owner.jpg")
                }
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>

<<<<<<< HEAD
=======
            {/* Name + Phone + Address in one row on xl screens */}
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {`${formData.firstname} ${formData.lastname}`}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
<<<<<<< HEAD
                {formData.phone && (
                  <>
                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formData.phone}</p>
                  </>
                )}
                {formData.address && (
                  <>
                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formData.address}</p>
=======
                {user?.phone && (
                  <>
                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.phone}</p>
                  </>
                )}
                {user?.address && (
                  <>
                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user.address}</p>
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>

          <form onSubmit={handleSave} className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              {/* Profile Image */}
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Profile Image
                </h5>
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                    <img
<<<<<<< HEAD
                      src={imagePreview || "/images/user/owner.jpg"}
=======
                      src={
                        imagePreview ||
                        (user?.profileImage ? `${backendUrl}${user.profileImage}` : "/images/user/owner.jpg")
                      }
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
                      alt="Profile preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="profileImage">Upload New Image</Label>
                    <input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className={inputClass("profileImage")}
                    />
<<<<<<< HEAD
                    {errors.profileImage && (
                      <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>
                    )}
=======
                    {errors.profileImage && <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>}
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
                    <p className="mt-1 text-xs text-gray-500">JPG, PNG or GIF (Max 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label htmlFor="firstname">First Name</Label>
                    <Input
                      id="firstname"
                      name="firstname"
                      type="text"
                      value={formData.firstname}
<<<<<<< HEAD
                      onChange={(e) =>
                        setFormData({ ...formData, firstname: e.target.value })
                      }
                      placeholder="Enter your first name"
                      className={inputClass("firstname")}
                    />
                    {errors.firstname && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>
                    )}
=======
                      onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
                      placeholder="Enter your first name"
                      className={inputClass("firstname")}
                    />
                    {errors.firstname && <p className="mt-1 text-sm text-red-600">{errors.firstname}</p>}
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
                  </div>

                  <div>
                    <Label htmlFor="lastname">Last Name</Label>
                    <Input
                      id="lastname"
                      name="lastname"
                      type="text"
                      value={formData.lastname}
<<<<<<< HEAD
                      onChange={(e) =>
                        setFormData({ ...formData, lastname: e.target.value })
                      }
                      placeholder="Enter your last name"
                      className={inputClass("lastname")}
                    />
                    {errors.lastname && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>
                    )}
=======
                      onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                      placeholder="Enter your last name"
                      className={inputClass("lastname")}
                    />
                    {errors.lastname && <p className="mt-1 text-sm text-red-600">{errors.lastname}</p>}
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="text"
                      value={formData.phone}
<<<<<<< HEAD
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="Enter your phone number"
                      className={inputClass("phone")}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
=======
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                      className={inputClass("phone")}
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
<<<<<<< HEAD
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
=======
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
                      placeholder="Enter your address"
                      rows={3}
                      className={inputClass("address")}
                    />
<<<<<<< HEAD
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
=======
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
>>>>>>> 9366e7e235c66c680354e16c22955b374b60a0c8
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button type="button" onClick={resetForm} disabled={loading}>
                Reset
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
