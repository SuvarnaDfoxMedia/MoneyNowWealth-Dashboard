"use client";

import React from "react";
import Image from "next/image";
import { useFetchCMS } from "@/hooks/useFetchCMS";
import bannerImage from "@/app/assets/privacypolicy-bg.png";

const PrivacyPolicyPage = () => {
  const slug = "privacy-policy-for-mutual-fund-investors";
  const { page, loading, error } = useFetchCMS(slug);

  if (loading) return <p className="text-center py-10 text-lg">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-600 text-lg">{error}</p>;

  return (
<<<<<<< HEAD
    <div className="font-poppins mb-10 ">
=======
    <div className="font-poppins">
>>>>>>> 61ecdb653ba564ce63de3a28b2f54c2f65a196ec

      <div className="w-full h-[260px] relative mb-10">
        <Image
          src={bannerImage}
          alt="Privacy Policy Banner"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-semibold tracking-wide font-inter">
            Privacy Policy
          </h1>
        </div>
      </div>

<<<<<<< HEAD
      <div className="max-w-6xl mx-auto px-4 pb-2">
=======
      <div className="max-w-6xl mx-auto px-4 pb-16">
>>>>>>> 61ecdb653ba564ce63de3a28b2f54c2f65a196ec

        <h1 className="text-[26px] font-bold mb-6 font-inter">
          {page?.title}
        </h1>

<<<<<<< HEAD
        <div className="space-y-4">
          {page?.sections?.map((section: any, index: number) => (
            <div
              key={index}
              className="pb-4 border-b border-gray-200 last:border-none last:pb-0"
            >
              {/* Section Title */}
              {section.title && (
                <h2 className="text-[20px] font-semibold mb-2 font-inter">
=======
        <div className="space-y-8">
          {page?.sections?.map((section: any, index: number) => (
            <div
              key={index}
              className="pb-6 border-b border-gray-200 last:border-none last:pb-0"
            >
              {/* Section Title */}
              {section.title && (
                <h2 className="text-[20px] font-semibold mb-3 font-inter">
>>>>>>> 61ecdb653ba564ce63de3a28b2f54c2f65a196ec
                  {section.title}
                </h2>
              )}

              {/* Section Content */}
              <div
<<<<<<< HEAD
                className="prose prose-stone max-w-none text-[15.5px] leading-[1.75] font-poppins "
=======
                className="prose prose-stone max-w-none text-[15.5px] leading-[1.75] font-poppins"
>>>>>>> 61ecdb653ba564ce63de3a28b2f54c2f65a196ec
                dangerouslySetInnerHTML={{ __html: section.content }}
              />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
