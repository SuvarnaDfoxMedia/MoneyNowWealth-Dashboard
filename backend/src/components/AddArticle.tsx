
// import React, { useEffect, useState, ChangeEvent } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   FiSave,
//   FiRefreshCw,
//   FiArrowLeft,
//   FiPlus,
//   FiTrash2,
// } from "react-icons/fi";
// import { toast } from "react-hot-toast";
// import { RichTextField } from "../components/PagesComponent/RichTextField";
// import { useCommonCrud } from "../hooks/useCommonCrud";
// import { axiosApi } from "../api/axios";

// interface Topic {
//   _id: string;
//   title: string;
// }

// interface Section {
//   title: string;
//   content: string;
// }

// interface Faq {
//   question: string;
//   answer: string;
// }

// interface Tool {
//   name: string;
//   url: string;
// }

// interface RelatedRead {
//   topic_code: string;
//   title: string;
// }

// interface ArticleForm {
//   topic_id: string;
//   title: string;
//   slug: string;
//   seo_title: string;
//   introduction: string;
//   seo_description: string;
//   hero_image?: File | string;
//   focus_keyword: string;
//   read_time: number;
//   author: string;
//   status: string;
//   sections: Section[];
//   faqs: Faq[];
//   tools: Tool[];
//   related_reads: RelatedRead[];
// }

// const UPLOAD_BASE = `${import.meta.env.VITE_API_BASE.replace(
//   "/api",
//   ""
// )}/uploads/article`;

// const generateSlug = (text: string) =>
//   text
//     .toLowerCase()
//     .trim()
//     .replace(/[^a-z0-9\s-]/g, "")
//     .replace(/\s+/g, "-")
//     .replace(/-+/g, "-");

// export default function AddArticle() {
//   const { id, role } = useParams();
//   const navigate = useNavigate();
//   const { getOne, createRecord, updateRecord } = useCommonCrud({
//     role,
//     module: "article",
//   });

//   const [values, setValues] = useState<ArticleForm>({
//     topic_id: "",
//     title: "",
//     slug: "",
//     seo_title: "",
//     introduction: "",
//     seo_description: "",
//     focus_keyword: "",
//     read_time: 0,
//     author: "",
//     status: "draft",
//     sections: [],
//     faqs: [],
//     tools: [],
//     related_reads: [],
//   });

//   const [topics, setTopics] = useState<Topic[]>([]);
//   const [file, setFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [slugEdited, setSlugEdited] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const fetchTopics = async () => {
//       try {
//         const res = await axiosApi.getList("/topic");
//         setTopics(res.data || res.topics || []);
//       } catch {
//         toast.error("Failed to load topics");
//       }
//     };
//     fetchTopics();
//   }, []);

//   useEffect(() => {
//     const loadData = async () => {
//       if (!id) return;
//       const data = await getOne(id);
//       if (data) {
//         const heroImg =
//           data.hero_image &&
//           (data.hero_image.startsWith("http")
//             ? data.hero_image
//             : `${UPLOAD_BASE}/${data.hero_image.replace(/.*[\\/]/, "")}`);

//         setValues({
//           topic_id: data.topic_id?._id?.toString() || "",
//           title: data.title || "",
//           slug: data.slug || "",
//           seo_title: data.seo_title || "",
//           introduction: data.introduction || "",
//           seo_description: data.seo_description || "",
//           focus_keyword: data.focus_keyword || "",
//           read_time: data.read_time || 0,
//           author: data.author || "",
//           status: data.status || "draft",
//           sections: data.sections || [],
//           faqs: data.faqs || [],
//           tools: data.tools || [],
//           related_reads: data.related_reads || [],
//           hero_image: data.hero_image || "",
//         });
//         setPreviewUrl(heroImg || "");
//       }
//     };
//     if (topics.length > 0) loadData();
//   }, [id, topics]);

//   const onChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setValues((prev) => {
//       const updated = { ...prev, [name]: value };
//       if (name === "title" && !slugEdited) updated.slug = generateSlug(value);
//       if (name === "slug") setSlugEdited(true);
//       return updated;
//     });
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   const handleHeroImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (!selectedFile) return;
//     if (!selectedFile.type.startsWith("image/")) {
//       setErrors((p) => ({ ...p, hero_image: "Only image files allowed" }));
//       return;
//     }
//     const img = new Image();
//     img.onload = () => {
//       if (img.width !== 1140 || img.height !== 590) {
//         setErrors((p) => ({ ...p, hero_image: "Image must be 1140×590" }));
//       } else {
//         setErrors((p) => ({ ...p, hero_image: "" }));
//         setFile(selectedFile);
//         setPreviewUrl(URL.createObjectURL(selectedFile));
//       }
//     };
//     img.src = URL.createObjectURL(selectedFile);
//   };

//   const addItem = (key: keyof ArticleForm, item: any) =>
//     setValues((prev) => ({ ...prev, [key]: [...(prev[key] as any[]), item] }));

//   const removeItem = (key: keyof ArticleForm, index: number) =>
//     setValues((prev) => ({
//       ...prev,
//       [key]: (prev[key] as any[]).filter((_, i) => i !== index),
//     }));

//   const resetForm = () => {
//     setValues({
//       topic_id: "",
//       title: "",
//       slug: "",
//       seo_title: "",
//       introduction: "",
//       seo_description: "",
//       focus_keyword: "",
//       read_time: 0,
//       author: "",
//       status: "draft",
//       sections: [],
//       faqs: [],
//       tools: [],
//       related_reads: [],
//     });
//     setFile(null);
//     setPreviewUrl("");
//     setErrors({});
//   };

//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const newErrors: Record<string, string> = {};
//     if (!values.title.trim()) newErrors.title = "Title required";
//     if (!values.slug.trim()) newErrors.slug = "Slug required";
//     if (!file && !values.hero_image) newErrors.hero_image = "Hero image required";
//     if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

//     try {
//       setIsSubmitting(true);
//       const formData = new FormData();
//       Object.entries(values).forEach(([key, value]) => {
//         if (Array.isArray(value)) formData.append(key, JSON.stringify(value));
//         else if (value !== undefined && value !== null)
//           formData.append(key, value as string);
//       });
//       if (file) formData.append("hero_image", file);
//       if (id) await updateRecord(id, formData);
//       else await createRecord(formData);
//       navigate(`/${role}/article`);
//     } catch (err: any) {
//       toast.error(err.message || "Failed to save article");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold text-[#043f79]">
//           {id ? "Edit Article" : "Add New Article"}
//         </h2>
//         <button
//           onClick={() => navigate(`/${role}/article`)}
//           className="bg-[#043f79] text-white px-3 py-1 rounded-md shadow hover:opacity-90 flex items-center gap-2"
//         >
//           <FiArrowLeft /> Back
//         </button>
//       </div>

//       <form onSubmit={onSubmit} className="space-y-6">
//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className="font-medium text-gray-700">Topic</label>
//             <select
//               name="topic_id"
//               value={values.topic_id}
//               onChange={onChange}
//               className="w-full border mt-2 p-2 rounded-md"
//             >
//               <option value="">-- Select Topic --</option>
//               {topics.map((t) => (
//                 <option key={t._id} value={t._id}>
//                   {t.title}
//                 </option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="font-medium text-gray-700">Title</label>
//             <input
//               name="title"
//               value={values.title}
//               onChange={onChange}
//               placeholder="Enter article title"
//               className="w-full border mt-2 p-2 rounded-md"
//             />
//             {errors.title && (
//               <p className="text-red-500 text-sm">{errors.title}</p>
//             )}
//           </div>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className="font-medium text-gray-700">Slug</label>
//             <input
//               name="slug"
//               value={values.slug}
//               onChange={onChange}
//               placeholder="Enter slug"
//               className="w-full border mt-2 p-2 rounded-md"
//             />
//           </div>
//           <div>
//             <label className="font-medium text-gray-700">SEO Title</label>
//             <input
//               name="seo_title"
//               value={values.seo_title}
//               onChange={onChange}
//               placeholder="Enter SEO title"
//               className="w-full border mt-2 p-2 rounded-md"
//             />
//           </div>
//         </div>

//         <div>
//           <label className="font-medium text-gray-700">Introduction</label>
//           <RichTextField
//             value={values.introduction}
//             onChange={(val) => setValues((p) => ({ ...p, introduction: val }))}
//           />
//         </div>

//         <div>
//           <label className="font-medium text-gray-700">SEO Description</label>
//           <textarea
//             name="seo_description"
//             value={values.seo_description}
//             onChange={onChange}
//             rows={3}
//             className="w-full border mt-2 p-2 rounded-md"
//           />
//         </div>

//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className="font-medium text-gray-700">
//               Hero Image <span className="text-sm text-gray-500">(1140×590)</span>
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={handleHeroImageChange}
//               className="mt-2"
//             />
//             {previewUrl && (
//               <img
//                 src={previewUrl}
//                 alt="Hero Preview"
//                 className="mt-3 w-64 h-36 object-cover rounded-md border"
//               />
//             )}
//             {errors.hero_image && (
//               <p className="text-red-500 text-sm">{errors.hero_image}</p>
//             )}
//           </div>
//           <div>
//             <label className="font-medium text-gray-700">Focus Keyword</label>
//             <input
//               name="focus_keyword"
//               value={values.focus_keyword}
//               onChange={onChange}
//               className="w-full border mt-2 p-2 rounded-md"
//             />
//           </div>
//         </div>

//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className="font-medium text-gray-700">Status</label>
//             <select
//               name="status"
//               value={values.status}
//               onChange={onChange}
//               className="w-full border mt-2 p-2 rounded-md"
//             >
//               <option value="draft">Draft</option>
//               <option value="published">Published</option>
//               <option value="archived">Archived</option>
//             </select>
//           </div>
//           <div>
//             <label className="font-medium text-gray-700">Author</label>
//             <input
//               name="author"
//               value={values.author}
//               onChange={onChange}
//               placeholder="Enter author name"
//               className="w-full border mt-2 p-2 rounded-md"
//             />
//           </div>
//         </div>

//         {["sections", "faqs", "tools", "related_reads"].map((key) => (
//           <div key={key} className="border-gray-200 rounded-md p-4">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="text-lg font-semibold text-[#043f79] capitalize">
//                 {key.replace("_", " ")}
//               </h3>
//               <button
//                 type="button"
//                 onClick={() =>
//                   addItem(
//                     key as keyof ArticleForm,
//                     key === "faqs"
//                       ? { question: "", answer: "" }
//                       : key === "sections"
//                       ? { title: "", content: "" }
//                       : key === "tools"
//                       ? { name: "", url: "" }
//                       : { topic_code: "", title: "" }
//                   )
//                 }
//                 className="bg-[#043f79] text-white px-3 py-1 rounded-md flex items-center gap-2 hover:opacity-90"
//               >
//                 <FiPlus /> Add
//               </button>
//             </div>

//             {(values[key as keyof ArticleForm] as any[]).length === 0 && (
//               <p className="text-sm text-gray-500 italic">No records added yet.</p>
//             )}

//             {(values[key as keyof ArticleForm] as any[]).map((item, i) => (
//               <div
//                 key={i}
//                 className="p-3 mb-3 bg-gray-50 border border-gray-200 rounded-md"
//               >
//                 {"title" in item || "question" in item || "name" in item ? (
//                   <input
//                     placeholder={
//                       "title" in item
//                         ? "Title"
//                         : "question" in item
//                         ? "Question"
//                         : "Name"
//                     }
//                     value={item.title || item.question || item.name || ""}
//                     onChange={(e) =>
//                       setValues((p) => {
//                         const arr = [...(p[key as keyof ArticleForm] as any[])];
//                         if ("title" in item) arr[i].title = e.target.value;
//                         else if ("question" in item)
//                           arr[i].question = e.target.value;
//                         else arr[i].name = e.target.value;
//                         return { ...p, [key]: arr };
//                       })
//                     }
//                     className="w-full border mt-2 p-2 rounded-md mb-2"
//                   />
//                 ) : null}

//                 <RichTextField
//                   value={
//                     item.content ||
//                     item.answer ||
//                     item.url ||
//                     item.topic_code ||
//                     ""
//                   }
//                   onChange={(v) =>
//                     setValues((p) => {
//                       const arr = [...(p[key as keyof ArticleForm] as any[])];
//                       if ("content" in item) arr[i].content = v;
//                       else if ("answer" in item) arr[i].answer = v;
//                       else if ("url" in item) arr[i].url = v;
//                       else if ("topic_code" in item) arr[i].topic_code = v;
//                       return { ...p, [key]: arr };
//                     })
//                   }
//                 />

//                 <button
//                   type="button"
//                   onClick={() => removeItem(key as keyof ArticleForm, i)}
//                   className="text-red-600 mt-3 flex items-center gap-1 text-sm"
//                 >
//                   <FiTrash2 /> Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//         ))}

//         <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
//           <button
//             type="button"
//             onClick={resetForm}
//             className="bg-[#043f79] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-90"
//           >
//             <FiRefreshCw /> Reset
//           </button>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-[#043f79] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-90"
//           >
//             <FiSave /> {id ? "Update" : "Save"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }




// import React, { useEffect, useState, ChangeEvent } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { FiSave, FiRefreshCw, FiArrowLeft, FiPlus, FiTrash2 } from "react-icons/fi";
// import { toast } from "react-hot-toast";
// import { RichTextField } from "../components/PagesComponent/RichTextField";
// import { useCommonCrud } from "../hooks/useCommonCrud";
// import { axiosApi } from "../api/axios";

// interface Topic { _id: string; title: string; }
// interface Section { title: string; content: string; }
// interface Faq { question: string; answer: string; }
// interface Tool { name: string; url: string; }
// interface RelatedRead { topic_code: string; title: string; }

// interface ArticleForm {
//   topic_id: string;
//   title: string;
//   slug: string;
//   seo_title: string;
//   introduction: string;
//   seo_description: string;
//   hero_image?: File | string;
//   focus_keyword: string;
//   read_time: number;
//   author: string;
//   status: string;
//   sections: Section[];
//   faqs: Faq[];
//   tools: Tool[];
//   related_reads: RelatedRead[];
// }

// const UPLOAD_BASE = `${import.meta.env.VITE_API_BASE.replace("/api", "")}/uploads/hero`;

// const generateSlug = (text: string) =>
//   text.toLowerCase().trim()
//       .replace(/[^a-z0-9\s-]/g, "")
//       .replace(/\s+/g, "-")
//       .replace(/-+/g, "-");

// export default function AddArticle() {
//   const { id, role } = useParams();
//   const navigate = useNavigate();
//   const { getOne, createRecord, updateRecord } = useCommonCrud({ role, module: "article" });

//   const [values, setValues] = useState<ArticleForm>({
//     topic_id: "",
//     title: "",
//     slug: "",
//     seo_title: "",
//     introduction: "",
//     seo_description: "",
//     focus_keyword: "",
//     read_time: 0,
//     author: "",
//     status: "draft",
//     sections: [],
//     faqs: [],
//     tools: [],
//     related_reads: [],
//   });

//   const [topics, setTopics] = useState<Topic[]>([]);
//   const [file, setFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState("");
//   const [slugEdited, setSlugEdited] = useState(false);
//   const [errors, setErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Fetch topics
//   useEffect(() => {
//     const fetchTopics = async () => {
//       try {
//         const res = await axiosApi.getList("/topic");
//         setTopics(res.data || res.topics || []);
//       } catch {
//         toast.error("Failed to load topics");
//       }
//     };
//     fetchTopics();
//   }, []);

//   // Load article if editing
//   useEffect(() => {
//     const loadData = async () => {
//       if (!id) return;
//       const data = await getOne(id);
//       if (data) {
//         const heroImg =
//           data.hero_image &&
//           (data.hero_image.startsWith("http")
//             ? data.hero_image
//             : `${UPLOAD_BASE}/${data.hero_image.replace(/.*[\\/]/, "")}`);
//         setValues({
//           topic_id: data.topic_id?._id?.toString() || "",
//           title: data.title || "",
//           slug: data.slug || "",
//           seo_title: data.seo_title || "",
//           introduction: data.introduction || "",
//           seo_description: data.seo_description || "",
//           focus_keyword: data.focus_keyword || "",
//           read_time: data.read_time || 0,
//           author: data.author || "",
//           status: data.status || "draft",
//           sections: data.sections || [],
//           faqs: data.faqs || [],
//           tools: data.tools || [],
//           related_reads: data.related_reads || [],
//           hero_image: data.hero_image || "",
//         });
//         setPreviewUrl(heroImg || "");
//       }
//     };
//     if (topics.length > 0) loadData();
//   }, [id, topics]);

//   // Handle input changes
//   const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
//     setValues((prev) => {
//       const updated = { ...prev, [name]: value };
//       if (name === "title" && !slugEdited) updated.slug = generateSlug(value);
//       if (name === "slug") setSlugEdited(true);
//       return updated;
//     });
//     setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   // Hero image selection & preview
//   const handleHeroImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (!selectedFile) return;

//     if (!selectedFile.type.startsWith("image/")) {
//       setErrors((p) => ({ ...p, hero_image: "Only image files allowed" }));
//       return;
//     }

//     const img = new Image();
//     img.onload = () => {
//       if (img.width !== 1140 || img.height !== 590) {
//         setErrors((p) => ({ ...p, hero_image: "Image must be 1140×590" }));
//       } else {
//         setErrors((p) => ({ ...p, hero_image: "" }));
//         setFile(selectedFile);
//         setPreviewUrl(URL.createObjectURL(selectedFile));
//       }
//     };
//     img.src = URL.createObjectURL(selectedFile);
//   };

//   // Dynamic fields handlers
//   const addItem = (key: keyof ArticleForm, item: any) =>
//     setValues((prev) => ({ ...prev, [key]: [...(prev[key] as any[]), item] }));

//   const removeItem = (key: keyof ArticleForm, index: number) =>
//     setValues((prev) => ({
//       ...prev,
//       [key]: (prev[key] as any[]).filter((_, i) => i !== index),
//     }));

//   const resetForm = () => {
//     setValues({
//       topic_id: "",
//       title: "",
//       slug: "",
//       seo_title: "",
//       introduction: "",
//       seo_description: "",
//       focus_keyword: "",
//       read_time: 0,
//       author: "",
//       status: "draft",
//       sections: [],
//       faqs: [],
//       tools: [],
//       related_reads: [],
//     });
//     setFile(null);
//     setPreviewUrl("");
//     setErrors({});
//     setSlugEdited(false);
//   };

//   // Submit form
//   const onSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const newErrors: Record<string, string> = {};
//     if (!values.title.trim()) newErrors.title = "Title required";
//     if (!values.slug.trim()) newErrors.slug = "Slug required";
//     if (!file && !values.hero_image) newErrors.hero_image = "Hero image required";
//     if (Object.keys(newErrors).length > 0) return setErrors(newErrors);

//     try {
//       setIsSubmitting(true);
//       const formData = new FormData();
//       Object.entries(values).forEach(([key, value]) => {
//         if (Array.isArray(value)) formData.append(key, JSON.stringify(value));
//         else if (value !== undefined && value !== null) formData.append(key, value as string);
//       });
//       if (file) formData.append("hero_image", file);
//       else if (typeof values.hero_image === "string") formData.append("hero_image", values.hero_image);

//       if (id) await updateRecord(id, formData);
//       else await createRecord(formData);
//       navigate(`/${role}/article`);
//     } catch (err: any) {
//       toast.error(err.message || "Failed to save article");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
//       <div className="flex justify-between items-center mb-6">
//         <h2 className="text-2xl font-semibold text-[#043f79]">
//           {id ? "Edit Article" : "Add New Article"}
//         </h2>
//         <button
//           onClick={() => navigate(`/${role}/article`)}
//           className="bg-[#043f79] text-white px-3 py-1 rounded-md shadow hover:opacity-90 flex items-center gap-2"
//         >
//           <FiArrowLeft /> Back
//         </button>
//       </div>

//       <form onSubmit={onSubmit} className="space-y-6">
//         {/* Topic & Title */}
//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className="font-medium text-gray-700">Topic</label>
//             <select
//               name="topic_id"
//               value={values.topic_id}
//               onChange={onChange}
//               className="w-full border mt-2 p-2 rounded-md"
//             >
//               <option value="">-- Select Topic --</option>
//               {topics.map((t) => (
//                 <option key={t._id} value={t._id}>{t.title}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="font-medium text-gray-700">Title</label>
//             <input
//               name="title"
//               value={values.title}
//               onChange={onChange}
//               placeholder="Enter article title"
//               className="w-full border mt-2 p-2 rounded-md"
//             />
//             {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
//           </div>
//         </div>

//         {/* Slug & SEO Title */}
//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className="font-medium text-gray-700">Slug</label>
//             <input
//               name="slug"
//               value={values.slug}
//               onChange={onChange}
//               placeholder="Enter slug"
//               className="w-full border mt-2 p-2 rounded-md"
//             />
//           </div>
//           <div>
//             <label className="font-medium text-gray-700">SEO Title</label>
//             <input
//               name="seo_title"
//               value={values.seo_title}
//               onChange={onChange}
//               placeholder="Enter SEO title"
//               className="w-full border mt-2 p-2 rounded-md"
//             />
//           </div>
//         </div>

//         {/* Introduction & SEO Description */}
//         <div>
//           <label className="font-medium text-gray-700">Introduction</label>
//           <RichTextField
//             value={values.introduction}
//             onChange={(val) => setValues((p) => ({ ...p, introduction: val }))}
//           />
//         </div>

//         <div>
//           <label className="font-medium text-gray-700">SEO Description</label>
//           <textarea
//             name="seo_description"
//             value={values.seo_description}
//             onChange={onChange}
//             rows={3}
//             className="w-full border mt-2 p-2 rounded-md"
//           />
//         </div>

//         {/* Hero Image & Focus Keyword */}
//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className="font-medium text-gray-700">
//               Hero Image <span className="text-sm text-gray-500">(1140×590)</span>
//             </label>
//             <input type="file" accept="image/*" onChange={handleHeroImageChange} className="mt-2" />
//             {previewUrl && (
//               <img src={previewUrl} alt="Hero Preview" className="mt-3 w-64 h-36 object-cover rounded-md border" />
//             )}
//             {errors.hero_image && <p className="text-red-500 text-sm">{errors.hero_image}</p>}
//           </div>
//           <div>
//             <label className="font-medium text-gray-700">Focus Keyword</label>
//             <input
//               name="focus_keyword"
//               value={values.focus_keyword}
//               onChange={onChange}
//               className="w-full border mt-2 p-2 rounded-md"
//             />
//           </div>
//         </div>

//         {/* Status & Author */}
//         <div className="grid md:grid-cols-2 gap-6">
//           <div>
//             <label className="font-medium text-gray-700">Status</label>
//             <select
//               name="status"
//               value={values.status}
//               onChange={onChange}
//               className="w-full border mt-2 p-2 rounded-md"
//             >
//               <option value="draft">Draft</option>
//               <option value="published">Published</option>
//               <option value="archived">Archived</option>
//             </select>
//           </div>
//           <div>
//             <label className="font-medium text-gray-700">Author</label>
//             <input
//               name="author"
//               value={values.author}
//               onChange={onChange}
//               placeholder="Enter author name"
//               className="w-full border mt-2 p-2 rounded-md"
//             />
//           </div>
//         </div>

//         {/* Dynamic Fields */}
//         {["sections", "faqs", "tools", "related_reads"].map((key) => (
//           <div key={key} className="border-gray-200 rounded-md p-4">
//             <div className="flex justify-between items-center mb-3">
//               <h3 className="text-lg font-semibold text-[#043f79] capitalize">{key.replace("_", " ")}</h3>
//               <button
//                 type="button"
//                 onClick={() =>
//                   addItem(
//                     key as keyof ArticleForm,
//                     key === "faqs"
//                       ? { question: "", answer: "" }
//                       : key === "sections"
//                       ? { title: "", content: "" }
//                       : key === "tools"
//                       ? { name: "", url: "" }
//                       : { topic_code: "", title: "" }
//                   )
//                 }
//                 className="bg-[#043f79] text-white px-3 py-1 rounded-md flex items-center gap-2 hover:opacity-90"
//               >
//                 <FiPlus /> Add
//               </button>
//             </div>

//             {(values[key as keyof ArticleForm] as any[]).length === 0 && (
//               <p className="text-sm text-gray-500 italic">No records added yet.</p>
//             )}

//             {(values[key as keyof ArticleForm] as any[]).map((item, i) => (
//               <div key={i} className="p-3 mb-3 bg-gray-50 border border-gray-200 rounded-md">
//                 {"title" in item || "question" in item || "name" in item ? (
//                   <input
//                     placeholder={
//                       "title" in item ? "Title" : "question" in item ? "Question" : "Name"
//                     }
//                     value={item.title || item.question || item.name || ""}
//                     onChange={(e) =>
//                       setValues((p) => {
//                         const arr = [...(p[key as keyof ArticleForm] as any[])];
//                         if ("title" in item) arr[i].title = e.target.value;
//                         else if ("question" in item) arr[i].question = e.target.value;
//                         else arr[i].name = e.target.value;
//                         return { ...p, [key]: arr };
//                       })
//                     }
//                     className="w-full border mt-2 p-2 rounded-md mb-2"
//                   />
//                 ) : null}

//                 <RichTextField
//                   value={item.content || item.answer || item.url || item.topic_code || ""}
//                   onChange={(v) =>
//                     setValues((p) => {
//                       const arr = [...(p[key as keyof ArticleForm] as any[])];
//                       if ("content" in item) arr[i].content = v;
//                       else if ("answer" in item) arr[i].answer = v;
//                       else if ("url" in item) arr[i].url = v;
//                       else if ("topic_code" in item) arr[i].topic_code = v;
//                       return { ...p, [key]: arr };
//                     })
//                   }
//                 />

//                 <button
//                   type="button"
//                   onClick={() => removeItem(key as keyof ArticleForm, i)}
//                   className="text-red-600 mt-3 flex items-center gap-1 text-sm"
//                 >
//                   <FiTrash2 /> Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//         ))}

//         {/* Submit & Reset */}
//         <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
//           <button
//             type="button"
//             onClick={resetForm}
//             className="bg-[#043f79] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-90"
//           >
//             <FiRefreshCw /> Reset
//           </button>
//           <button
//             type="submit"
//             disabled={isSubmitting}
//             className="bg-[#043f79] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-90"
//           >
//             <FiSave /> {id ? "Update" : "Save"}
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// }


import React, { useEffect, useState, ChangeEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiSave, FiRefreshCw, FiArrowLeft, FiPlus, FiTrash2 } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { RichTextField } from "../components/PagesComponent/RichTextField";
import { useCommonCrud } from "../hooks/useCommonCrud";
import { axiosApi } from "../api/axios";

/* ----------------------
   Types
   ---------------------- */
interface Topic {
  _id: string;
  title: string;
}

interface Section {
  title: string;
  content: string;
}

interface Faq {
  question: string;
  answer: string;
}

interface Tool {
  name: string;
  url: string;
}

interface RelatedRead {
  topic_code: string;
  title: string;
}

/* Article object shape returned by getOne */
interface ArticleResponse {
  _id?: string;
  topic_id?: { _id?: string; title?: string } | string;
  title?: string;
  slug?: string;
  seo_title?: string;
  introduction?: string;
  seo_description?: string;
  hero_image?: string;
  focus_keyword?: string;
  read_time?: number;
  author?: string;
  status?: string;
  sections?: Section[];
  faqs?: Faq[];
  tools?: Tool[];
  related_reads?: RelatedRead[];
}

/* API list response for topics (handle multiple shapes) */
type TopicListResponse =
  | { data?: Topic[] }
  | { topics?: Topic[] }
  | Topic[];

/* Form state shape */
interface ArticleForm {
  topic_id: string;
  title: string;
  slug: string;
  seo_title: string;
  introduction: string;
  seo_description: string;
  hero_image?: File | string;
  focus_keyword: string;
  read_time: number;
  author: string;
  status: string;
  sections: Section[];
  faqs: Faq[];
  tools: Tool[];
  related_reads: RelatedRead[];
}

/* ----------------------
   Constants
   ---------------------- */
const UPLOAD_BASE = `${import.meta.env.VITE_API_BASE.replace("/api", "")}/uploads/hero`;

const generateSlug = (text: string) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

/* ----------------------
   Component
   ---------------------- */
export default function AddArticle() {
  const { id, role } = useParams<{ id?: string; role?: string }>();
  const navigate = useNavigate();
  const { getOne, createRecord, updateRecord } = useCommonCrud({ role, module: "article" });

  const [values, setValues] = useState<ArticleForm>({
    topic_id: "",
    title: "",
    slug: "",
    seo_title: "",
    introduction: "",
    seo_description: "",
    focus_keyword: "",
    read_time: 0,
    author: "",
    status: "draft",
    sections: [],
    faqs: [],
    tools: [],
    related_reads: [],
  });

  const [topics, setTopics] = useState<Topic[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [slugEdited, setSlugEdited] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /* ----------------------
     Fetch topics (handles multiple response shapes)
     ---------------------- */
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = (await axiosApi.getList<TopicListResponse>("/topic")) as TopicListResponse;

        // Support multiple shapes: { data: Topic[] } , { topics: Topic[] }, or Topic[]
        const topicsFromRes: Topic[] =
          Array.isArray(res) ? res : (res as any).data || (res as any).topics || [];

        setTopics(topicsFromRes);
      } catch (err) {
        toast.error("Failed to load topics");
      }
    };

    fetchTopics();
  }, []);

  /* ----------------------
     Load article if editing
     ---------------------- */
  useEffect(() => {
    const loadData = async () => {
      if (!id) return;

      try {
        const raw = await getOne(id);
        // getOne might return the object directly or { data: obj }
        const data = (raw && (raw as any).data) ? (raw as any).data as ArticleResponse : (raw as ArticleResponse);

        if (!data || typeof data !== "object") {
          toast.error("Article not found");
          return;
        }

        // compute hero preview url if we received a string
        const heroImg =
          typeof data.hero_image === "string" && data.hero_image
            ? data.hero_image.startsWith("http")
              ? data.hero_image
              : `${UPLOAD_BASE}/${data.hero_image.replace(/.*[\\/]/, "")}`
            : "";

        setValues({
          topic_id: typeof data.topic_id === "string" ? data.topic_id : data.topic_id?._id?.toString() || "",
          title: data.title || "",
          slug: data.slug || "",
          seo_title: data.seo_title || "",
          introduction: data.introduction || "",
          seo_description: data.seo_description || "",
          focus_keyword: data.focus_keyword || "",
          read_time: data.read_time ?? 0,
          author: data.author || "",
          status: data.status || "draft",
          sections: Array.isArray(data.sections) ? data.sections : [],
          faqs: Array.isArray(data.faqs) ? data.faqs : [],
          tools: Array.isArray(data.tools) ? data.tools : [],
          related_reads: Array.isArray(data.related_reads) ? data.related_reads : [],
          hero_image: typeof data.hero_image === "string" ? data.hero_image : "",
        });

        setPreviewUrl(heroImg);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load article");
      }
    };

    // Wait until topics loaded (keeps topic select consistent)
    if (topics.length > 0) loadData();
  }, [id, topics, getOne]);

  /* ----------------------
     Generic input handler
     ---------------------- */
  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
    const name = target.name;
    const value = target.value;

    setValues((prev) => {
      const updated = { ...prev, [name]: value } as ArticleForm;
      if (name === "title" && !slugEdited) updated.slug = generateSlug(value);
      if (name === "slug") setSlugEdited(true);
      return updated;
    });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /* ----------------------
     Hero image selection & validation
     ---------------------- */
  const handleHeroImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setErrors((p) => ({ ...p, hero_image: "Only image files allowed" }));
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(selectedFile);
    img.onload = () => {
      // validate dimensions; if you want to accept other sizes remove this check
      if (img.width !== 1140 || img.height !== 590) {
        setErrors((p) => ({ ...p, hero_image: "Image must be 1140×590" }));
        URL.revokeObjectURL(objectUrl);
      } else {
        setErrors((p) => ({ ...p, hero_image: "" }));
        setFile(selectedFile);
        setPreviewUrl(objectUrl);
      }
    };
    img.onerror = () => {
      setErrors((p) => ({ ...p, hero_image: "Invalid image file" }));
      URL.revokeObjectURL(objectUrl);
    };
    img.src = objectUrl;
  };

  /* ----------------------
     Dynamic array helpers
     ---------------------- */
  const addItem = (key: keyof ArticleForm, item: any) =>
    setValues((prev) => ({ ...prev, [key]: [...(prev[key] as any[]), item] }));

  const removeItem = (key: keyof ArticleForm, index: number) =>
    setValues((prev) => ({ ...prev, [key]: (prev[key] as any[]).filter((_, i) => i !== index) }));

  /* ----------------------
     Reset form
     ---------------------- */
  const resetForm = () => {
    setValues({
      topic_id: "",
      title: "",
      slug: "",
      seo_title: "",
      introduction: "",
      seo_description: "",
      focus_keyword: "",
      read_time: 0,
      author: "",
      status: "draft",
      sections: [],
      faqs: [],
      tools: [],
      related_reads: [],
    });
    setFile(null);
    setPreviewUrl("");
    setErrors({});
    setSlugEdited(false);
  };

  /* ----------------------
     Submit (create / update)
     ---------------------- */
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!values.title.trim()) newErrors.title = "Title required";
    if (!values.slug.trim()) newErrors.slug = "Slug required";
    if (!file && !values.hero_image) newErrors.hero_image = "Hero image required";
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      // Append each field safely:
      Object.entries(values).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          // If value is number or boolean convert to string
          if (typeof value === "string") formData.append(key, value);
          else formData.append(key, String(value));
        }
      });

      if (file) formData.append("hero_image", file);
      else if (typeof values.hero_image === "string" && values.hero_image) {
        // Some APIs expect the file name or URL; append string if present
        formData.append("hero_image", values.hero_image);
      }

      if (id) {
        await updateRecord(id, formData);
        toast.success("Article updated");
      } else {
        await createRecord(formData);
        toast.success("Article created");
      }

      navigate(`/${role}/article`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Failed to save article");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ----------------------
     Render
     ---------------------- */
  return (
    <div className="p-6 bg-white rounded-xl shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-[#043f79]">{id ? "Edit Article" : "Add New Article"}</h2>
        <button
          onClick={() => navigate(`/${role}/article`)}
          className="bg-[#043f79] text-white px-3 py-1 rounded-md shadow hover:opacity-90 flex items-center gap-2"
        >
          <FiArrowLeft /> Back
        </button>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Topic & Title */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="font-medium text-gray-700">Topic</label>
            <select
              name="topic_id"
              value={values.topic_id}
              onChange={onChange}
              className="w-full border mt-2 p-2 rounded-md"
            >
              <option value="">-- Select Topic --</option>
              {topics.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-medium text-gray-700">Title</label>
            <input
              name="title"
              value={values.title}
              onChange={onChange}
              placeholder="Enter article title"
              className="w-full border mt-2 p-2 rounded-md"
            />
            {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
          </div>
        </div>

        {/* Slug & SEO Title */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="font-medium text-gray-700">Slug</label>
            <input name="slug" value={values.slug} onChange={onChange} placeholder="Enter slug" className="w-full border mt-2 p-2 rounded-md" />
          </div>
          <div>
            <label className="font-medium text-gray-700">SEO Title</label>
            <input
              name="seo_title"
              value={values.seo_title}
              onChange={onChange}
              placeholder="Enter SEO title"
              className="w-full border mt-2 p-2 rounded-md"
            />
          </div>
        </div>

        {/* Introduction & SEO Description */}
        <div>
          <label className="font-medium text-gray-700">Introduction</label>
          <RichTextField value={values.introduction} onChange={(val) => setValues((p) => ({ ...p, introduction: val }))} />
        </div>

        <div>
          <label className="font-medium text-gray-700">SEO Description</label>
          <textarea name="seo_description" value={values.seo_description} onChange={onChange} rows={3} className="w-full border mt-2 p-2 rounded-md" />
        </div>

        {/* Hero Image & Focus Keyword */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="font-medium text-gray-700">
              Hero Image <span className="text-sm text-gray-500">(1140×590)</span>
            </label>
            <input type="file" accept="image/*" onChange={handleHeroImageChange} className="mt-2" />
            {previewUrl && <img src={previewUrl} alt="Hero Preview" className="mt-3 w-64 h-36 object-cover rounded-md border" />}
            {errors.hero_image && <p className="text-red-500 text-sm">{errors.hero_image}</p>}
          </div>

          <div>
            <label className="font-medium text-gray-700">Focus Keyword</label>
            <input name="focus_keyword" value={values.focus_keyword} onChange={onChange} className="w-full border mt-2 p-2 rounded-md" />
          </div>
        </div>

        {/* Status & Author */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="font-medium text-gray-700">Status</label>
            <select name="status" value={values.status} onChange={onChange} className="w-full border mt-2 p-2 rounded-md">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div>
            <label className="font-medium text-gray-700">Author</label>
            <input name="author" value={values.author} onChange={onChange} placeholder="Enter author name" className="w-full border mt-2 p-2 rounded-md" />
          </div>
        </div>

        {/* Dynamic Fields: sections, faqs, tools, related_reads */}
        {(["sections", "faqs", "tools", "related_reads"] as Array<keyof ArticleForm>).map((key) => (
          <div key={key} className="border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold text-[#043f79] capitalize">{key.replace("_", " ")}</h3>
              <button
                type="button"
                onClick={() =>
                  addItem(
                    key,
                    key === "faqs"
                      ? { question: "", answer: "" }
                      : key === "sections"
                      ? { title: "", content: "" }
                      : key === "tools"
                      ? { name: "", url: "" }
                      : { topic_code: "", title: "" }
                  )
                }
                className="bg-[#043f79] text-white px-3 py-1 rounded-md flex items-center gap-2 hover:opacity-90"
              >
                <FiPlus /> Add
              </button>
            </div>

            {(values[key] as any[]).length === 0 && <p className="text-sm text-gray-500 italic">No records added yet.</p>}

            {(values[key] as any[]).map((item: any, i: number) => (
              <div key={i} className="p-3 mb-3 bg-gray-50 border border-gray-200 rounded-md">
                {("title" in item || "question" in item || "name" in item) && (
                  <input
                    placeholder={"title" in item ? "Title" : "question" in item ? "Question" : "Name"}
                    value={item.title || item.question || item.name || ""}
                    onChange={(e) =>
                      setValues((p) => {
                        const arr = [...(p[key] as any[])];
                        if ("title" in item) arr[i].title = e.target.value;
                        else if ("question" in item) arr[i].question = e.target.value;
                        else arr[i].name = e.target.value;
                        return { ...p, [key]: arr };
                      })
                    }
                    className="w-full border mt-2 p-2 rounded-md mb-2"
                  />
                )}

                <RichTextField
                  value={item.content || item.answer || item.url || item.topic_code || ""}
                  onChange={(v) =>
                    setValues((p) => {
                      const arr = [...(p[key] as any[])];
                      if ("content" in item) arr[i].content = v;
                      else if ("answer" in item) arr[i].answer = v;
                      else if ("url" in item) arr[i].url = v;
                      else if ("topic_code" in item) arr[i].topic_code = v;
                      return { ...p, [key]: arr };
                    })
                  }
                />

                <button type="button" onClick={() => removeItem(key, i)} className="text-red-600 mt-3 flex items-center gap-1 text-sm">
                  <FiTrash2 /> Remove
                </button>
              </div>
            ))}
          </div>
        ))}

        {/* Submit & Reset */}
        <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
          <button type="button" onClick={resetForm} className="bg-[#043f79] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-90">
            <FiRefreshCw /> Reset
          </button>

          <button type="submit" disabled={isSubmitting} className="bg-[#043f79] text-white px-4 py-2 rounded-md flex items-center gap-2 hover:opacity-90">
            <FiSave /> {id ? "Update" : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
