import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "react-hot-toast";
import { useCommonCrud } from "../hooks/useCommonCrud";

interface Section {
  title?: string;
  content?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface CmsPage {
  _id: string;
  title: string;
  slug?: string;
  sections?: Section[];
  faqs?: FAQ[];
  status?: string;
  is_active?: number;
  page_code?: string;
  created_at?: string;
}

export default function ViewCmsPage() {
  const { id, role } = useParams();
  const navigate = useNavigate();

  const { getOne } = useCommonCrud({
    role: role || "admin",
    module: "cmspages",
  });

  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const response = await getOne(id!);
        const pageData = response?.page || response; // ✅ FIX: handle nested `page` key

        if (pageData?._id || pageData?.title) {
          setPage(pageData);
        } else {
          toast.error("CMS Page not found or deleted.");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch CMS Page details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPage();
  }, [id]);

  if (loading)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-lg">
        Loading CMS Page...
      </div>
    );

  if (!page)
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-500 text-lg">
        CMS Page not found.
      </div>
    );

  return (
    <div className="bg-gray-50 min-h-screen py-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md overflow-hidden rounded-lg">
        <div className="flex justify-end px-6 pt-6">
          <button
            onClick={() => navigate(`/${role || "admin"}/cmspages`)}
            className="bg-[#043f79] text-white px-4 py-2 rounded-md shadow-md hover:scale-105 hover:bg-[#064d99] transition flex items-center gap-2"
          >
            <FiArrowLeft /> Back
          </button>
        </div>

        <div className="px-6 py-10 md:px-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            {page.title}
          </h1>

          <div className="text-gray-500 text-sm mb-8">
            <span>
              {page.created_at
                ? new Date(page.created_at).toLocaleDateString()
                : ""}
            </span>{" "}
            • <span>{page.status || "draft"}</span>{" "}
            {page.is_active ? (
              <span className="text-green-600 font-medium">• Active</span>
            ) : (
              <span className="text-red-500 font-medium">• Inactive</span>
            )}
          </div>

          {page.sections?.length ? (
            <div className="space-y-10">
              {page.sections.map((sec, idx) => (
                <div key={idx}>
                  {sec.title && (
                    <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                      {sec.title}
                    </h2>
                  )}
                  {sec.content && (
                    <div
                      className="prose max-w-none prose-headings:text-gray-900 prose-p:text-gray-700"
                      dangerouslySetInnerHTML={{ __html: sec.content }}
                    />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic mb-10">No sections found.</p>
          )}

          {page.faqs?.length ? (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                FAQs
              </h2>
              <div className="space-y-6">
                {page.faqs.map((faq, idx) => (
                  <div key={idx} className="border-b pb-4">
                    <h3 className="font-semibold text-gray-800">
                      {faq.question}
                    </h3>
                    <div
                      className="text-gray-700 mt-2 prose"
                      dangerouslySetInnerHTML={{ __html: faq.answer }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
