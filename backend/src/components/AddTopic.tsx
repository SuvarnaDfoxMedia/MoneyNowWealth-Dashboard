
// import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   FiSave,
//   FiRefreshCw,
//   FiArrowLeft,
//   FiChevronDown,
//   FiCalendar,
// } from "react-icons/fi";
// import { toast } from "react-hot-toast";
// import { useCommonCrud } from "../hooks/useCommonCrud";
// import axiosApi from "../api/axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// interface TopicForm {
//   cluster_id: string;
//   title: string;
//   slug: string;
//   keywords?: string;
//   summary?: string;
//   status: "draft" | "published" | "archived";
//   author?: string;
//   read_time_minutes?: number;
//   tags?: string;
//   is_active?: number;
//   publish_date?: Date | null;
//   access_type?: "free" | "premium"; //  renamed to match backend
// }

// interface ClusterOption {
//   _id: string;
//   title: string;
// }

// export default function AddTopic() {
//   const { id } = useParams<{ id?: string }>();
//   const navigate = useNavigate();
//   const { getOne, createRecord, updateRecord } = useCommonCrud({
//     role: "admin",
//     module: "topic",
//   });

//   const [values, setValues] = useState<TopicForm>({
//     cluster_id: "",
//     title: "",
//     slug: "",
//     keywords: "",
//     summary: "",
//     status: "draft",
//     author: "",
//     read_time_minutes: 0,
//     tags: "",
//     is_active: 0,
//     publish_date: null,
//     access_type: "free", //  renamed and default corrected
//   });

//   const [clusters, setClusters] = useState<ClusterOption[]>([]);
//   const [slugEdited, setSlugEdited] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Fetch clusters
//   useEffect(() => {
//     const fetchClusters = async () => {
//       try {
//         const res = await axiosApi.get(`/cluster?limit=1000`);
//         setClusters(res.data?.clusters || []);
//       } catch {
//         toast.error("Failed to load clusters");
//       }
//     };
//     fetchClusters();
//   }, []);

//   // Fetch topic if editing
//   useEffect(() => {
//     if (!id) return;
//     const fetchTopic = async () => {
//       try {
//         const { success, topic } = await getOne(id);
//         if (success && topic) {
//           setValues({
//             cluster_id:
//               typeof topic.cluster_id === "object"
//                 ? topic.cluster_id?._id || ""
//                 : topic.cluster_id || "",
//             title: topic.title || "",
//             slug: topic.slug || "",
//             keywords: topic.keywords?.join(", ") || "",
//             summary: topic.summary || "",
//             status: topic.status || "draft",
//             author: topic.author || "",
//             read_time_minutes: topic.read_time_minutes || 0,
//             tags: topic.tags?.join(", ") || "",
//             is_active: topic.is_active ?? 0,
//             publish_date: topic.publish_date
//               ? new Date(topic.publish_date)
//               : null,
//             access_type: topic.access_type || "free", //  fetch correct field
//           });
//           if (topic.slug) setSlugEdited(true);
//         } else {
//           toast.error("Topic not found");
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Failed to fetch topic details");
//       }
//     };
//     fetchTopic();
//   }, [id]);

//   // Slug generation
//   const generateSlug = (text: string) =>
//     text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

//   const handleInputChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setValues((prev) => {
//       const updated = { ...prev, [name]: value };
//       if (name === "title" && !slugEdited) updated.slug = generateSlug(value);
//       return updated;
//     });
//     if (name === "slug") setSlugEdited(true);
//   };

//   // Submit form
//   const handleSubmit = async (e: FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const payload = {
//         ...values,
//         publish_date: values.publish_date
//           ? values.publish_date.toISOString()
//           : null,
//         keywords: values.keywords
//           ? values.keywords.split(",").map((k) => k.trim())
//           : [],
//         tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : [],
//       };

//       if (id) {
//         await updateRecord(id, payload);
//         toast.success("Topic updated successfully");
//       } else {
//         await createRecord(payload);
//         toast.success("Topic created successfully");
//       }

//       navigate("/admin/topic");
//     } catch (error: any) {
//       console.error("Error saving topic:", error);
//       toast.error(error.response?.data?.message || "Failed to save topic");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const inputClass =
//     "w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 font-normal";

//   return (
//     <main className="bg-gray-50 min-h-screen">
//       <div className="bg-white p-6 rounded-xl shadow-lg space-y-5">
//         <div className="flex justify-between items-center mb-5 pb-4">
//           <h2 className="text-xl font-medium text-gray-800">
//             {id ? "Edit Topic" : "Add Topic"}
//           </h2>
//           <button
//             type="button"
//             onClick={() => navigate("/admin/topic")}
//             className="bg-[#043f79] text-white px-3 py-1 rounded-md shadow-lg hover:scale-105 transition flex items-center gap-2"
//           >
//             <FiArrowLeft /> Back
//           </button>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Cluster Select */}
//           <div>
//             <label className="block mb-1 text-gray-700">Cluster</label>
//             <div className="relative">
//               <select
//                 name="cluster_id"
//                 value={values.cluster_id}
//                 onChange={handleInputChange}
//                 className={`${inputClass} pr-10 appearance-none`}
//                 required
//               >
//                 <option value="">Select Cluster</option>
//                 {clusters.map((c) => (
//                   <option key={c._id} value={c._id}>
//                     {c.title}
//                   </option>
//                 ))}
//               </select>
//               <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
//                 <FiChevronDown className="text-gray-500" />
//               </span>
//             </div>
//           </div>

//           {/* Title & Slug */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block mb-1 text-gray-700">Title</label>
//               <input
//                 name="title"
//                 value={values.title}
//                 onChange={handleInputChange}
//                 placeholder="Enter title"
//                 className={inputClass}
//                 required
//               />
//             </div>
//             <div>
//               <label className="block mb-1 text-gray-700">Slug</label>
//               <input
//                 name="slug"
//                 value={values.slug}
//                 onChange={handleInputChange}
//                 placeholder="Enter slug"
//                 className={inputClass}
//                 required
//               />
//             </div>
//           </div>

//           {/*  Access Type */}
//           <div>
//             <label className="block mb-1 text-gray-700">Topic Type</label>
//             <div className="relative">
//               <select
//                 name="access_type" //  correct field name
//                 value={values.access_type || "free"}
//                 onChange={handleInputChange}
//                 className={`${inputClass} pr-10 appearance-none`}
//               >
//                 <option value="free">Free</option>
//                 <option value="premium">Premium</option>
//               </select>
//               <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
//                 <FiChevronDown className="text-gray-500" />
//               </span>
//             </div>
//           </div>

//           {/* Summary */}
//           <div>
//             <label className="block mb-1 text-gray-700">Summary</label>
//             <textarea
//               name="summary"
//               value={values.summary}
//               onChange={handleInputChange}
//               placeholder="Enter summary"
//               className={inputClass}
//               rows={3}
//             />
//           </div>

//           {/* Keywords & Tags */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block mb-1 text-gray-700">Keywords</label>
//               <input
//                 name="keywords"
//                 value={values.keywords}
//                 onChange={handleInputChange}
//                 placeholder="Comma separated keywords"
//                 className={inputClass}
//               />
//             </div>
//             <div>
//               <label className="block mb-1 text-gray-700">Tags</label>
//               <input
//                 name="tags"
//                 value={values.tags}
//                 onChange={handleInputChange}
//                 placeholder="Comma separated tags"
//                 className={inputClass}
//               />
//             </div>
//           </div>

//           {/* Author & Read Time */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block mb-1 text-gray-700">Author</label>
//               <input
//                 name="author"
//                 value={values.author}
//                 onChange={handleInputChange}
//                 placeholder="Enter author name"
//                 className={inputClass}
//               />
//             </div>
//             <div>
//               <label className="block mb-1 text-gray-700">
//                 Read Time (minutes)
//               </label>
//               <input
//                 type="number"
//                 name="read_time_minutes"
//                 value={values.read_time_minutes || ""}
//                 onChange={(e) =>
//                   setValues((prev) => ({
//                     ...prev,
//                     read_time_minutes:
//                       e.target.value === "" ? 0 : Number(e.target.value),
//                   }))
//                 }
//                 className={inputClass}
//               />
//             </div>
//           </div>

//           {/* Status & Publish Date */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label className="block mb-1 text-gray-700">Status</label>
//               <div className="relative">
//                 <select
//                   name="status"
//                   value={values.status}
//                   onChange={handleInputChange}
//                   className={`${inputClass} pr-10 appearance-none`}
//                 >
//                   <option value="draft">Draft</option>
//                   <option value="published">Published</option>
//                   <option value="archived">Archived</option>
//                 </select>
//                 <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
//                   <FiChevronDown className="text-gray-500" />
//                 </span>
//               </div>
//             </div>

//             {/* Publish Date */}
//             <div>
//               <label className="block mb-1 text-gray-700">Publish Date</label>
//               <div className="relative">
//                 <DatePicker
//                   selected={values.publish_date}
//                   onChange={(date) =>
//                     setValues((prev) => ({ ...prev, publish_date: date }))
//                   }
//                   dateFormat="yyyy-MM-dd"
//                   className={`${inputClass} pr-11`}
//                   placeholderText="Select a date"
//                 />
//                 <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
//                   <FiCalendar className="w-5 h-5" />
//                 </span>
//               </div>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex gap-4 justify-end mt-4 pt-4">
//             <button
//               type="button"
//               onClick={() => {
//                 setValues({
//                   cluster_id: "",
//                   title: "",
//                   slug: "",
//                   keywords: "",
//                   summary: "",
//                   status: "draft",
//                   author: "",
//                   read_time_minutes: 0,
//                   tags: "",
//                   is_active: 0,
//                   publish_date: null,
//                   access_type: "free", //  reset correct field
//                 });
//                 setSlugEdited(false);
//               }}
//               className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 transition flex items-center gap-2"
//             >
//               <FiRefreshCw /> Reset
//             </button>

//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="bg-[#043f79] text-white px-4 py-2 rounded-md shadow-lg hover:scale-105 transition flex items-center gap-2"
//             >
//               <FiSave /> {isSubmitting ? "Saving..." : id ? "Update" : "Save"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </main>
//   );
// }


import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  useParams,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import {
  FiSave,
  FiRefreshCw,
  FiArrowLeft,
  FiChevronDown,
  FiCalendar,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useCommonCrud } from "../hooks/useCommonCrud";
import axiosApi from "../api/axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TopicForm {
  cluster_id: string;
  title: string;
  slug: string;
  keywords?: string;
  summary?: string;
  status: "draft" | "published" | "archived";
  author?: string;
  read_time_minutes?: number;
  tags?: string;
  is_active?: number;
  publish_date?: Date | null;
  access_type?: "free" | "premium";
}

interface ClusterOption {
  _id: string;
  title: string;
}

export default function AddTopic() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const limit = searchParams.get("limit") || 10;

  const { getOne, createRecord, updateRecord } = useCommonCrud({
    role: "admin",
    module: "topic",
  });

  const [values, setValues] = useState<TopicForm>({
    cluster_id: "",
    title: "",
    slug: "",
    keywords: "",
    summary: "",
    status: "draft",
    author: "",
    read_time_minutes: 0,
    tags: "",
    is_active: 0,
    publish_date: null,
    access_type: "free",
  });

  const [clusters, setClusters] = useState<ClusterOption[]>([]);
  const [slugEdited, setSlugEdited] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch clusters
  useEffect(() => {
    const fetchClusters = async () => {
      try {
        const res = await axiosApi.get(`/cluster?limit=1000`);
        setClusters(res.data?.clusters || []);
      } catch {
        toast.error("Failed to load clusters");
      }
    };
    fetchClusters();
  }, []);

  // Fetch topic if editing
  useEffect(() => {
    if (!id) return;
    const fetchTopic = async () => {
      try {
        const { success, topic } = await getOne(id);
        if (success && topic) {
          setValues({
            cluster_id:
              typeof topic.cluster_id === "object"
                ? topic.cluster_id?._id || ""
                : topic.cluster_id || "",
            title: topic.title || "",
            slug: topic.slug || "",
            keywords: topic.keywords?.join(", ") || "",
            summary: topic.summary || "",
            status: topic.status || "draft",
            author: topic.author || "",
            read_time_minutes: topic.read_time_minutes || 0,
            tags: topic.tags?.join(", ") || "",
            is_active: topic.is_active ?? 0,
            publish_date: topic.publish_date
              ? new Date(topic.publish_date)
              : null,
            access_type: topic.access_type || "free",
          });
          if (topic.slug) setSlugEdited(true);
        } else {
          toast.error("Topic not found");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch topic details");
      }
    };
    fetchTopic();
  }, [id]);

  // Slug generation
  const generateSlug = (text: string) =>
    text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-");

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setValues((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "title" && !slugEdited) updated.slug = generateSlug(value);
      return updated;
    });
    if (name === "slug") setSlugEdited(true);
  };

  // Submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        ...values,
        publish_date: values.publish_date
          ? values.publish_date.toISOString()
          : null,
        keywords: values.keywords
          ? values.keywords.split(",").map((k) => k.trim())
          : [],
        tags: values.tags ? values.tags.split(",").map((t) => t.trim()) : [],
      };

      if (id) {
        await updateRecord(id, payload);
        toast.success("Topic updated successfully");
      } else {
        await createRecord(payload);
        toast.success("Topic created successfully");
      }

      navigate(`/admin/topic?page=${page}&limit=${limit}`);
    } catch (error: any) {
      console.error("Error saving topic:", error);
      toast.error(error.response?.data?.message || "Failed to save topic");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700 font-normal";

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-5">
        <div className="flex justify-between items-center mb-5 pb-4">
          <h2 className="text-xl font-medium text-gray-800">
            {id ? "Edit Topic" : "Add Topic"}
          </h2>
          <button
            type="button"
            onClick={() => navigate(`/admin/topic?page=${page}&limit=${limit}`)}
            className="bg-[#043f79] text-white px-3 py-1 rounded-md shadow-lg hover:scale-105 transition flex items-center gap-2"
          >
            <FiArrowLeft /> Back
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Cluster Select */}
          <div>
            <label className="block mb-1 text-gray-700">Cluster</label>
            <div className="relative">
              <select
                name="cluster_id"
                value={values.cluster_id}
                onChange={handleInputChange}
                className={`${inputClass} pr-10 appearance-none`}
                required
              >
                <option value="">Select Cluster</option>
                {clusters.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <FiChevronDown className="text-gray-500" />
              </span>
            </div>
          </div>

          {/* Title & Slug */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-700">Title</label>
              <input
                name="title"
                value={values.title}
                onChange={handleInputChange}
                placeholder="Enter title"
                className={inputClass}
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Slug</label>
              <input
                name="slug"
                value={values.slug}
                onChange={handleInputChange}
                placeholder="Enter slug"
                className={inputClass}
                required
              />
            </div>
          </div>

          {/* Access Type */}
          <div>
            <label className="block mb-1 text-gray-700">Topic Type</label>
            <div className="relative">
              <select
                name="access_type"
                value={values.access_type || "free"}
                onChange={handleInputChange}
                className={`${inputClass} pr-10 appearance-none`}
              >
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
              <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <FiChevronDown className="text-gray-500" />
              </span>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block mb-1 text-gray-700">Summary</label>
            <textarea
              name="summary"
              value={values.summary}
              onChange={handleInputChange}
              placeholder="Enter summary"
              className={inputClass}
              rows={3}
            />
          </div>

          {/* Keywords & Tags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-700">Keywords</label>
              <input
                name="keywords"
                value={values.keywords}
                onChange={handleInputChange}
                placeholder="Comma separated keywords"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">Tags</label>
              <input
                name="tags"
                value={values.tags}
                onChange={handleInputChange}
                placeholder="Comma separated tags"
                className={inputClass}
              />
            </div>
          </div>

          {/* Author & Read Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-700">Author</label>
              <input
                name="author"
                value={values.author}
                onChange={handleInputChange}
                placeholder="Enter author name"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-700">
                Read Time (minutes)
              </label>
              <input
                type="number"
                name="read_time_minutes"
                value={values.read_time_minutes || ""}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    read_time_minutes:
                      e.target.value === "" ? 0 : Number(e.target.value),
                  }))
                }
                className={inputClass}
              />
            </div>
          </div>

          {/* Status & Publish Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-gray-700">Status</label>
              <div className="relative">
                <select
                  name="status"
                  value={values.status}
                  onChange={handleInputChange}
                  className={`${inputClass} pr-10 appearance-none`}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <FiChevronDown className="text-gray-500" />
                </span>
              </div>
            </div>

            {/* Publish Date */}
            <div>
              <label className="block mb-1 text-gray-700">Publish Date</label>
              <div className="relative">
                <DatePicker
                  selected={values.publish_date}
                  onChange={(date) =>
                    setValues((prev) => ({ ...prev, publish_date: date }))
                  }
                  dateFormat="yyyy-MM-dd"
                  className={`${inputClass} pr-11`}
                  placeholderText="Select a date"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  <FiCalendar className="w-5 h-5" />
                </span>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 justify-end mt-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setValues({
                  cluster_id: "",
                  title: "",
                  slug: "",
                  keywords: "",
                  summary: "",
                  status: "draft",
                  author: "",
                  read_time_minutes: 0,
                  tags: "",
                  is_active: 0,
                  publish_date: null,
                  access_type: "free",
                });
                setSlugEdited(false);
              }}
              className="bg-gray-200 text-gray-700 px-3 py-2 rounded-md hover:bg-gray-300 transition flex items-center gap-2"
            >
              <FiRefreshCw /> Reset
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#043f79] text-white px-4 py-2 rounded-md shadow-lg hover:scale-105 transition flex items-center gap-2"
            >
              <FiSave /> {isSubmitting ? "Saving..." : id ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
