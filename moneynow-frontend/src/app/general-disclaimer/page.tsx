"use client";

import React from "react";
import Image from "next/image";
import { useFetchCMS } from "@/hooks/useFetchCMS";
import bannerImage from "@/app/assets/privacypolicy-bg.png"; // Replace with your disclaimer banner image

const GeneralDisclaimerPage = () => {
  const slug = "general-disclaimer"; // CMS slug for the disclaimer page
  const { page, loading, error } = useFetchCMS(slug);

  if (loading) return <p className="text-center py-10 text-lg">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-600 text-lg">{error}</p>;

  return (
    <div className="font-poppins mb-10">

      {/* Banner Section */}
      <div className="w-full h-[260px] relative mb-10">
        <Image
          src={bannerImage}
          alt="General Disclaimer Banner"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-semibold tracking-wide font-inter">
            General Disclaimer
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 pb-2">

        {/* Page Title */}
        <h1 className="text-[26px] font-bold mb-6 font-inter">
          {page?.title}
        </h1>

        {/* Sections */}
        <div className="space-y-4">
          {page?.sections?.map((section: any, index: number) => (
            <div
              key={index}
              className="pb-4 border-b border-gray-200 last:border-none last:pb-0"
            >
              {/* Section Title */}
              {section.title && (
                <h2 className="text-[20px] font-semibold mb-2 font-inter">
                  {section.title}
                </h2>
              )}

              {/* Section Content */}
              <div
                className="prose prose-stone max-w-none text-[15.5px] leading-[1.75] font-poppins"
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default GeneralDisclaimerPage;
