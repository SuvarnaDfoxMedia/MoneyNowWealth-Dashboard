import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import axios from "axios";
import toast from "react-hot-toast";

interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  role: string;
  profileImage: string | null;
  name?: string; // in case backend only gives full name
}

interface FormData {
  firstname: string;
  lastname: string;
  phone: string;
  address: string;
}

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    lastname: "",
    phone: "",
    address: ""
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/profile/`, {
        withCredentials: true
      });
      const userData = response.data;

      const [first, ...rest] = userData.name?.split(" ") || [];
      const last = rest.join(" ");

      setUser(userData);
      setFormData({
        firstname: first || '',
        lastname: last || '',
        phone: userData.phone || '',
        address: userData.address || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
    setFormErrors(prevErrors => {
      const newErrors = { ...prevErrors };
      delete newErrors[name];
      return newErrors;
    });
  }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();

      const fullName = `${formData.firstname} ${formData.lastname}`.trim();

      submitData.append('name', fullName);
      submitData.append('phone', formData.phone);
      submitData.append('address', formData.address);

      if (profileImage) {
        submitData.append('profileImage', profileImage);
      }

      const response = await axios.put(`${backendUrl}/api/profile`, submitData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUser(response.data.user);
      toast.success("Profile updated successfully!");

      setTimeout(() => {
        closeModal();
      }, 300);

      setProfileImage(null);
      setImagePreview(null);
    } catch (error: any) {
      
      if (error.response?.data?.errors) {
        const backendErrors = error.response.data.errors;
        const errorsObj: { [key: string]: string } = {};

        backendErrors.forEach((err: any) => {
          // Use 'param' or fallback to 'path'
          const fieldName = err.param || err.path;
          if (fieldName) {
            errorsObj[fieldName] = err.msg;
          }
        });

        setFormErrors(errorsObj);
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    closeModal();
    if (user) {
      const [first, ...rest] = user.name?.split(" ") || [];
      const last = rest.join(" ");
      setFormData({
        firstname: first || '',
        lastname: last || '',
        phone: user.phone || '',
        address: user.address || ''
      });
    }
    setProfileImage(null);
    setImagePreview(null);
  };

  if (!user) {
    return (
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img 
                crossOrigin="anonymous"
                src={imagePreview || (user.profileImage ? `${backendUrl}${user.profileImage}` : "/images/user/owner.jpg")} 
                alt="Profile preview" 
                className="object-cover w-full h-full"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {`${formData.firstname} ${formData.lastname}` || "User Name"}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                {user.phone && (
                  <>
                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.phone}
                    </p>
                  </>
                )}
                {user.address && (
                  <>
                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {user.address}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            {/* SVG icon */}
            Edit
          </button>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={handleModalClose} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
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
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Profile Image
                </h5>
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                    <img 
                      crossOrigin="anonymous"
                      src={imagePreview || (user.profileImage ? `${backendUrl}${user.profileImage}` : "/images/user/owner.jpg")} 
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
                      className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800"
                    />
                    <p className="mt-1 text-xs text-gray-500">JPG, PNG or GIF (Max 5MB)</p>
                  </div>
                </div>
              </div>

              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="firstname">First Name</Label>
                    <Input 
                      id="firstname"
                      name="firstname"
                      type="text" 
                      value={formData.firstname}
                      onChange={handleInputChange}
                      placeholder="Enter your first name"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="lastname">Last Name</Label>
                    <Input 
                      id="lastname"
                      name="lastname"
                      type="text" 
                      value={formData.lastname}
                      onChange={handleInputChange}
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email"
                      type="text" 
                      value={user.email}
                      disabled
                      className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                    />
                    <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone"
                      name="phone"
                      type="text" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className={formErrors.phone ? "border-red-500 ring-1 ring-red-500" : ""}
                    />
                    {formErrors.phone && (
                      <p className="text-sm text-red-500 mt-1">{formErrors.phone}</p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter your address"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button 
                type="button"
                size="sm" 
                variant="outline" 
                onClick={handleModalClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                size="sm" 
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
