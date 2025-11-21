// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { FiArrowLeft } from "react-icons/fi";
// import { toast } from "react-hot-toast";
// import { useCommonCrud } from "../hooks/useCommonCrud";

// interface Article {
//   _id: string;
//   title: string;
//   author?: string;
//   hero_image?: string | File;
//   introduction?: string;
//   sections?: { title?: string; content?: string }[];
//   faqs?: { question: string; answer: string }[];
//   tools?: { name: string; description: string }[];
//   related_reads?: { title: string; description: string }[];
//   seo_title?: string;
//   seo_description?: string;
//   focus_keyword?: string;
//   read_time?: number;
//   created_at?: string;
// }

// const API_BASE_URL = import.meta.env.VITE_API_BASE;

// export default function ViewArticle() {
//   const { id, role } = useParams();
//   const navigate = useNavigate();
//   const { getOne } = useCommonCrud({ role, module: "article" });
//   const [article, setArticle] = useState<Article | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchArticle = async () => {
//       try {
//         const response = await getOne(id!);
//         if (response?._id || response?.title) {
//           setArticle(response);
//         } else {
//           toast.error("Article not found or deleted.");
//         }
//       } catch (error: any) {
//         toast.error(error.message || "Failed to fetch article details.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (id) fetchArticle();
//   }, [id]);

//   const resolveImageUrl = (imagePath?: string | File) => {
//     if (!imagePath) return "";
//     if (typeof imagePath === "object") return URL.createObjectURL(imagePath);
//     if (imagePath.startsWith("blob:")) return imagePath;
//     if (imagePath.startsWith("/uploads/")) {
//       const base = API_BASE_URL.replace("/api", "");
//       return `${base}${imagePath}`;
//     }
//     if (imagePath.startsWith("http")) return imagePath;
//     const base = API_BASE_URL.replace("/api", "");
//     return `${base}/uploads/article/${imagePath}`;
//   };

//   if (loading)
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-lg">
//         Loading article...
//       </div>
//     );

//   if (!article)
//     return (
//       <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-lg">
//         Article not found.
//       </div>
//     );

//   const heroImage = resolveImageUrl(article.hero_image);

//   return (
//     <div className="bg-gray-50 min-h-screen py-6">
//       <div className="max-w-5xl mx-auto bg-white shadow-md overflow-hidden rounded-lg">
//         <div className="flex justify-end px-6 pt-6">
//           <button
//             onClick={() => navigate(`/${role || "admin"}/article`)}
//             className="bg-[#043f79] text-white px-4 py-2 rounded-md shadow-md hover:scale-105 hover:bg-[#064d99] transition flex items-center gap-2"
//           >
//             <FiArrowLeft /> Back
//           </button>
//         </div>

//         {heroImage ? (
//           <div className="mt-6">
//             <img
//               src={heroImage}
//               alt={article.title}
//               className="w-full h-auto max-h-[590px] object-cover border-t border-b"
//               onError={(e) => ((e.currentTarget.src = "/no-image.png"))}
//             />
//           </div>
//         ) : (
//           <div className="mt-6 flex justify-center items-center h-[200px] bg-gray-100 text-gray-400 italic">
//             No image available
//           </div>
//         )}

//         <div className="px-6 py-10 md:px-12">
//           <h1 className="text-3xl font-semibold text-gray-900 mb-4">
//             {article.title}
//           </h1>

//           <div className="text-gray-500 text-sm mb-8">
//             <span>By {article.author || "Admin"}</span> •{" "}
//             <span>
//               {article.created_at
//                 ? new Date(article.created_at).toLocaleDateString()
//                 : ""}
//             </span>{" "}
//             •{" "}
//             <span>
//               {article.read_time
//                 ? `${article.read_time} min read`
//                 : "Quick read"}
//             </span>
//           </div>

//          {article.introduction && (
//   <div
//     className="text-lg text-gray-700 leading-relaxed mb-6 border-l-4 border-indigo-500 pl-4 italic"
//     dangerouslySetInnerHTML={{
//       __html: article.introduction.replace(/^<p>|<\/p>$/g, ''),
//     }}
//   />
// )}


//           {article.sections?.length ? (
//             <div className="space-y-8">
//               {article.sections.map((sec, idx) => (
//                 <div key={idx}>
//                   {sec.title && (
//                     <h2 className="text-2xl font-semibold text-gray-800 mb-3">
//                       {sec.title}
//                     </h2>
//                   )}
//                   {sec.content && (
//                     <div
//                       className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-img:rounded-lg prose-img:shadow-lg prose-a:text-indigo-600 hover:prose-a:text-indigo-800"
//                       dangerouslySetInnerHTML={{ __html: sec.content }}
//                     />
//                   )}
//                 </div>
//               ))}
//             </div>
//           ) : null}

//           {article.faqs?.length ? (
//             <div className="mt-12">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//                 FAQs
//               </h2>
//               <div className="space-y-6">
//                 {article.faqs.map((faq, idx) => (
//                   <div key={idx} className="border-b pb-4">
//                     <h3 className="font-semibold text-gray-800">
//                       {faq.question}
//                     </h3>
//                     <div
//                       className="text-gray-700 mt-2 prose"
//                       dangerouslySetInnerHTML={{ __html: faq.answer }}
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : null}

//           {article.tools?.length ? (
//             <div className="mt-12">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//                 Tools Used
//               </h2>
//               <ul className="list-disc pl-6 space-y-3 text-gray-700">
//                 {article.tools.map((tool, idx) => (
//                   <li key={idx}>
//                     <strong>{tool.name}</strong>: {tool.description}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           ) : null}

//           {article.related_reads?.length ? (
//             <div className="mt-12">
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//                 Related Reads
//               </h2>
//               <div className="grid md:grid-cols-2 gap-6">
//                 {article.related_reads.map((rr, idx) => (
//                   <div
//                     key={idx}
//                     className="p-4 border rounded-lg bg-gray-50 hover:shadow-md transition"
//                   >
//                     <h3 className="font-semibold text-gray-800 mb-2">
//                       {rr.title}
//                     </h3>
//                     <p className="text-gray-600 text-sm">{rr.description}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ) : null}
//         </div>

//         <div className="px-6 pb-8 md:px-12 border-t pt-6 bg-gray-50">
//           <h3 className="text-gray-800 font-semibold mb-2">SEO Information</h3>
//           <div className="text-sm text-gray-600 space-y-1">
//             {article.focus_keyword && (
//               <p>
//                 <strong>Focus Keyword:</strong> {article.focus_keyword}
//               </p>
//             )}
//             {article.seo_title && (
//               <p>
//                 <strong>SEO Title:</strong> {article.seo_title}
//               </p>
//             )}
//             {article.seo_description && (
//               <p>
//                 <strong>SEO Description:</strong> {article.seo_description}
//               </p>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useCommonCrud } from "../hooks/useCommonCrud";

interface Article {
  _id: string;
  title: string;
  author?: string;
  hero_image?: string | File;
  introduction?: string;
  sections?: { title?: string; content?: string }[];
  faqs?: { question: string; answer?: string }[];
  tools?: { name: string; url?: string }[];
  related_reads?: { title: string; url?: string }[];
  seo_title?: string;
  seo_description?: string;
  focus_keyword?: string;
  read_time?: number;
  created_at?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE;

export default function ViewArticle() {
  const { id, role } = useParams();
  const navigate = useNavigate();
  const { getOne } = useCommonCrud({ role, module: "article" });
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        if (!id) return;
        const response = await getOne(id);
        if (response?._id || response?.title) {
          setArticle(response);
        } else {
          toast.error("Article not found or deleted.");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch article details.");
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  const resolveImageUrl = (imagePath?: string | File) => {
    if (!imagePath) return "";
    if (typeof imagePath === "object") return URL.createObjectURL(imagePath);
    if (imagePath.startsWith("blob:")) return imagePath;
    if (imagePath.startsWith("/uploads/")) {
      const base = API_BASE_URL.replace("/api", "");
      return `${base}${imagePath}`;
    }
    if (imagePath.startsWith("http")) return imagePath;
    const base = API_BASE_URL.replace("/api", "");
    return `${base}/uploads/article/${imagePath}`;
  };

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-lg">
        Loading article...
      </div>
    );

  if (!article)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-lg">
        Article not found.
      </div>
    );

  const heroImage = resolveImageUrl(article.hero_image);

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md overflow-hidden rounded-lg">
        {/* Back Button */}
        <div className="flex justify-end px-6 pt-6">
          <button
            onClick={() => navigate(`/${role || "admin"}/article`)}
            className="bg-[#043f79] text-white px-4 py-2 rounded-md shadow-md hover:scale-105 hover:bg-[#064d99] transition flex items-center gap-2"
          >
            <FiArrowLeft /> Back
          </button>
        </div>

        {/* Hero Image */}
        {heroImage ? (
          <div className="mt-6">
            <img
              src={heroImage}
              alt={article.title}
              className="w-full h-auto max-h-[590px] object-cover border-t border-b"
              onError={(e) => ((e.currentTarget.src = "/no-image.png"))}
            />
          </div>
        ) : (
          <div className="mt-6 flex justify-center items-center h-[200px] bg-gray-100 text-gray-400 italic">
            No image available
          </div>
        )}

        <div className="px-6 py-10 md:px-12">
          {/* Title & Meta */}
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">{article.title}</h1>
          <div className="text-gray-500 text-sm mb-8">
            <span>By {article.author || "Admin"}</span> •{" "}
            <span>{article.created_at ? new Date(article.created_at).toLocaleDateString() : ""}</span> •{" "}
            <span>{article.read_time ? `${article.read_time} min read` : "Quick read"}</span>
          </div>

          {/* Introduction */}
          {article.introduction && (
            <div
              className="text-lg text-gray-700 leading-relaxed mb-6 border-l-4 border-indigo-500 pl-4 italic"
              dangerouslySetInnerHTML={{ __html: article.introduction.replace(/^<p>|<\/p>$/g, "") }}
            />
          )}

          {/* Sections */}
          {article.sections?.length ? (
            <div className="space-y-8">
              {article.sections.map((sec, idx) => (
                <div key={idx}>
                  {sec.title && (
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">{sec.title}</h2>
                  )}
                  {sec.content && (
                    <div
                      className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-img:rounded-lg prose-img:shadow-lg prose-a:text-indigo-600 hover:prose-a:text-indigo-800"
                      dangerouslySetInnerHTML={{ __html: sec.content }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : null}

          {/* FAQs */}
          {article.faqs?.length ? (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">FAQs</h2>
              <div className="space-y-6">
                {article.faqs.map((faq, idx) => (
                  <div key={idx} className="border-b pb-4">
                    <h3 className="font-semibold text-gray-800">{faq.question}</h3>
                    <div
                      className="text-gray-700 mt-2 prose"
                      dangerouslySetInnerHTML={{ __html: faq.answer || "" }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {/* Tools / Actionables */}
          {article.tools?.length ? (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Actionables & Tools You Can Use</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {article.tools.map((tool, idx) => (
                  <li key={idx}>
                    {tool.url ? (
                      <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                        {tool.name}
                      </a>
                    ) : (
                      <span>{tool.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {/* Related Reads */}
          {article.related_reads?.length ? (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Related Reads / Related EDGE Articles</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                {article.related_reads.map((rr, idx) => (
                  <li key={idx}>
                    {rr.url ? (
                      <a href={rr.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800">
                        {rr.title}
                      </a>
                    ) : (
                      <span>{rr.title}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        {/* SEO */}
        <div className="px-6 pb-8 md:px-12 border-t pt-6 bg-gray-50">
          <h3 className="text-gray-800 font-semibold mb-2">SEO Information</h3>
          <div className="text-sm text-gray-600 space-y-1">
            {article.focus_keyword && <p><strong>Focus Keyword:</strong> {article.focus_keyword}</p>}
            {article.seo_title && <p><strong>SEO Title:</strong> {article.seo_title}</p>}
            {article.seo_description && <p><strong>SEO Description:</strong> {article.seo_description}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
