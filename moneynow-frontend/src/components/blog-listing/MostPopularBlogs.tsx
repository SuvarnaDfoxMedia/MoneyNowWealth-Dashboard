"use client";

import React from "react";
import Image from "next/image";

const MostPopularBlogs = () => {
  return (
    <div className="lg:col-span-4 mb-[30px] ">
      {/* Heading */}
      <h2 className="text-[30px] font-poppins font-semibold mb-4 border-b border-[#F0F0F0] pb-[15px]">
        Most Popular
      </h2>

      {/* Popular Blog List */}
      <div className="space-y-5">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex border-[#F0F0F0] pb-[30px] border-b  gap-2 items-start">
             {/* Content */}
            <div>
              <span className="block text-[18px]  font-bold text-[#043F79] mb-[8px]">
                Mutual Fund Basics
              </span>

              <p className="text-[20px] font-semibold leading-[26px] mb-[8px]">
                How to Choose the Right Mutual Fund?
              </p>

              <p className="text-[16px]  font-inter font-medium">
                Team Money Now &nbsp;|&nbsp; Dec 17, 2025
              </p>
            </div>

            {/* Image */}
            <div className="relative w-[124px] h-[104px] shrink-0">
              <Image
                src={`/images/most-popular-blog-img-1.png`}
                alt="Popular Blog"
                fill
                className="object-cover rounded-[6px]"
              />
            </div>

           

          </div>
        ))}
      </div>
    </div>
  );
};

export default MostPopularBlogs;
