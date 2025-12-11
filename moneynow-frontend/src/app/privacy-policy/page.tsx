"use client";

import React from "react";
import { useFetchPrivacyPolicy } from "@/hooks/useFetchPrivacyPolicy";

const PrivacyPolicyPage = () => {
  const { page, loading, error } = useFetchPrivacyPolicy();

  if (loading)
    return <p className="text-center py-10 text-lg font-medium">Loading...cms</p>;

  if (error)
    return (
      <p className="text-center py-10 text-red-600 text-lg font-medium">
        {error}
      </p>
    );

  return (
    <div className="max-w-4xl mx-auto px-4 py-14">
      {/* Page Title */}
      <h1 className="text-3xl font-bold mb-6">{page?.title}</h1>

      {/* Sections */}
      <div className="space-y-10">
        {page?.sections?.map((section, index) => (
          <div key={index}>
            {section.title && (
              <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
            )}

            {/* Render HTML content safely */}
            <div
              className="prose prose-stone max-w-none"
              dangerouslySetInnerHTML={{ __html: section.content }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
