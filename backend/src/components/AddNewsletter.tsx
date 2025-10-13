import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { FiSave, FiRefreshCw, FiArrowLeft } from "react-icons/fi";

export default function AddNewsletter() {
  const navigate = useNavigate();
  const { role } = useParams<{ role: string }>();
  const API_BASE = "http://localhost:5000/api";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please enter both name and email");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/newsletter`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || `Failed to submit (Status: ${res.status})`);
        return;
      }

      // Success toast with correct date
      toast.success(
        `Newsletter added successfully on ${new Date(data.newsletter.createdAt).toLocaleString()}`
      );

      setFormData({ name: "", email: "" });

      if (role) navigate(`/${role}/newsletter`);
      else navigate("/newsletter");
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong!");
    }
  };

  return (
    <main className="w-full px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Add Newsletter</h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white flex items-center gap-2 hover:opacity-90 transition transform hover:scale-105"
        >
          <FiArrowLeft /> Back
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-4"
      >
        <div>
          <label className="block font-medium mb-1">Full Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border p-2 rounded"
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
            onClick={() => setFormData({ name: "", email: "" })}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-[#043f79] to-[#0a68c1] text-white flex items-center gap-2 hover:opacity-90 transition transform hover:scale-105"
          >
            <FiRefreshCw /> Reset
          </button>
        </div>
      </form>
    </main>
  );
}
