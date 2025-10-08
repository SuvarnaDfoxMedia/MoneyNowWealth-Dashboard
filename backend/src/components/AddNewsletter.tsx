import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiSave, FiRefreshCw, FiArrowLeft } from "react-icons/fi";

export default function AddContactEnquiry() {
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>(); // get role from URL
  const API_BASE = "http://localhost:5000/api";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    subject: "Support",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!role) {
      toast.error("Role missing in URL");
      return;
    }

    const { fullName, email, subject, message } = formData;
    if (!fullName || !email || !subject || !message) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token") || "";

      const res = await fetch(`${API_BASE}/${role}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.status === 401) {
        toast.error("Unauthorized. Please login.");
        navigate("/login");
        return;
      }

      if (res.ok) {
        toast.success("Contact enquiry added successfully!");
        setFormData({
          fullName: "",
          email: "",
          mobile: "",
          subject: "Support",
          message: "",
        });
        navigate(`/${role}/contactenquiry`); // navigate to listing
      } else {
        toast.error(data.message || "Failed to add contact enquiry");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <main className="w-full px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Add Contact Enquiry</h2>
        <button
          type="button"
          onClick={() => navigate(`/${role}/contactenquiry`)} // back to listing
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white flex items-center gap-2 hover:opacity-90 transition transform hover:scale-105"
        >
          <FiArrowLeft /> Back
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
        <div>
          <label className="block font-medium mb-1">Full Name *</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email ID *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Mobile Number</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Subject *</label>
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Support">Support</option>
            <option value="Partner Inquiry">Partner Inquiry</option>
            <option value="Feedback">Feedback</option>
            <option value="Others">Others</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Message *</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Write your message here"
            className="w-full border p-2 rounded h-32 resize-none"
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white flex items-center gap-2 hover:opacity-90 transition transform hover:scale-105"
          >
            <FiSave /> Save
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData({
                fullName: "",
                email: "",
                mobile: "",
                subject: "Support",
                message: "",
              })
            }
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white flex items-center gap-2 hover:opacity-90 transition transform hover:scale-105"
          >
            <FiRefreshCw /> Reset
          </button>
        </div>
      </form>
    </main>
  );
}
