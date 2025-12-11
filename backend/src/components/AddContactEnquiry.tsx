import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiSave, FiRefreshCw, FiArrowLeft } from "react-icons/fi";

export default function AddContactEnquiry() {
  const { role } = useParams(); // ✅ useParams instead of localStorage
  const navigate = useNavigate();
  const API_BASE = "http://localhost:5000/api";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    subject: "Support",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { fullName, email, subject, message } = formData;
    if (!fullName || !email || !subject || !message) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: "include", // ✅ matches AddBlog
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Failed to submit enquiry");
        return;
      }

      toast.success("Contact enquiry submitted successfully!");

      // Reset
      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        subject: "Support",
        message: "",
      });

      // ✅ Immediate navigation (not delayed)
      navigate(`/${role || "admin"}/contactenquiry`);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <main className="w-full px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Add Contact Enquiry</h2>
        <button
          type="button"
          onClick={() => navigate(`/${role || "admin"}/contactenquiry`)}
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
            required
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
            required
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
            required
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
            required
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white flex items-center gap-2 hover:opacity-90 transition transform hover:scale-105"
          >
            <FiSave /> Submit
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

        <p className="text-gray-500 text-sm mt-2">
          Your information is safe with us. We don’t spam or sell your data.
        </p>
      </form>
    </main>
  );
}
