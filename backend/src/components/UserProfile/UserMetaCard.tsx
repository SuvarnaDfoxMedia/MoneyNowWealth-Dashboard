import { useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import axios from "axios";
import toast from "react-hot-toast";
import { useUser } from "../../context/UserContext";

export default function UserMetaCard() {
  const { isOpen, openModal, closeModal } = useModal();
  const { user, refreshUser } = useUser();
  const [formData, setFormData] = useState({ firstname: "", lastname: "", phone: "", address: "" });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (user) {
      const [first, ...rest] = user.name?.split(" ") || [];
      setFormData({
        firstname: first || "",
        lastname: rest.join(" ") || "",
        phone: user.phone || "",
        address: user.address || ""
      });
    }
  }, [user]);

  useEffect(() => {
    if (user?.profileImage) {
      setImagePreview(`${backendUrl}${user.profileImage}?v=${Date.now()}`);
    }
  }, [user?.profileImage]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = new FormData();
      submitData.append("name", `${formData.firstname} ${formData.lastname}`);
      submitData.append("phone", formData.phone);
      submitData.append("address", formData.address);
      if (profileImage) submitData.append("profileImage", profileImage);

      await axios.put(`${backendUrl}/api/profile`, submitData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" }
      });

      await refreshUser(); 
      toast.success("Profile updated successfully!");
      closeModal();
      setProfileImage(null);
      setImagePreview(null);

    } catch (err: any) {
      toast.error("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      {/* User Card */}
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img
                src={imagePreview || (user?.profileImage ? `${backendUrl}${user.profileImage}` : "/images/user/owner.jpg")}
                alt="Profile"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {`${formData.firstname} ${formData.lastname}`}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
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
          {/* Close Button inside Form */}
          <button
            type="button"
            onClick={closeModal}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            &times;
          </button>

          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>

          <form onSubmit={handleSave} className="flex flex-col">
            {/* Scrollable Content */}
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              {/* Profile Image */}
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Profile Image
                </h5>
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
                    <img
                      src={imagePreview || (user?.profileImage ? `${backendUrl}${user.profileImage}` : "/images/user/owner.jpg")}
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

              {/* Personal Info */}
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
                      onChange={e => setFormData({ ...formData, firstname: e.target.value })}
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
                      onChange={e => setFormData({ ...formData, lastname: e.target.value })}
                      placeholder="Enter your last name"
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="text"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="address">Address</Label>
                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter your address"
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button type="button" onClick={closeModal} disabled={loading}>
                Cancel
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
