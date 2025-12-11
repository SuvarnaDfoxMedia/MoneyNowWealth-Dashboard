"use client";

import React from "react";
import Image from "next/image";

const BlogListingBanner = () => {
  return (
    <section className="w-full">
      <Image
        src="/images/blog-listing-banner.png"  // ← your banner image
        alt="Blog Listing Banner"
        width={1920}
        height={500}
        className="w-full h-auto object-cover"
        priority
      />
    </section>
  );
};

export default BlogListingBanner;
