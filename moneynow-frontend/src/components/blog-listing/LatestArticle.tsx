// "use client";

// import React from "react";
// import Image from "next/image";
// import Link from "next/link";
// import MostPopularBlogs from "@/components/blog-listing/MostPopularBlogs";
// import ResearchDesk from "@/components/blog-listing/ResearchDesk";
// import HomeInvestTrack from "@/components/home/home-invest-track";
// import StayConnected from "@/components/home/stay-connected";
// import {homeInvestTrackData} from "@/data/homePageData";


// const LatestArticle = () => {
//   return (
//     <>
//       <section className="font-poppins w-full py-6   mb-[30px] md:mb-[120px]">
//       <div className="max-w-full mx-auto px-6 ">
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-[30px]">

//           {/* LEFT SECTION */}
//           <div className="lg:col-span-8 border-r border-[#F0F0F0] pr-[24px]">
//           <div className="border-b border-[#F0F0F0] mb-[30px]">

//              <p className="text-[30px] font-poppins font-semibold mb-4 border-b border-[#F0F0F0] pb-[15px]">
//               Latest Articles
//             </p>


//           <div className="relative">
//                 <span className="text-[20px] font-inter text-[#043F79] font-bold">
//                   Mutual Fund Basics
//                 </span>
//                 <h3 className="text-[30px] font-semibold mt-1 mb-1">
//                   What is a Mutual Fund?
//                 </h3>
//                 <p className="text-[16px] font-medium font-inter  mb-[25px]">
//                  Team Money Now  |  Dec 17, 2025, 09:33 AM
//                 </p>
//               </div>
//             {/* Featured Article */}
//          <div className="bg-white rounded mb-[20px]">
//   <Image
//     src="/images/article-img-1.png"
//     alt="Latest Article"
//     width={1200}
//     height={450}
//     className="w-full h-auto rounded mb-[20px]"
//     priority
//   />

//   <p className="text-[18px] leading-[28px] font-inter ">
//     If you’ve ever wondered how to invest without tracking individual stocks or learning complex financial jargon, mutual funds might be your answer.
//   </p>
//        </div>
//        </div>

//             {/* Small Articles */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//   {[1, 2].map((item) => (
//     <div key={item} className="bg-white">
      
//       {/* Text Content */}
//       <div className="mb-5">
//         <span className="block text-[18px] font-bold font-inter text-[#043F79] mb-2">
//           Mutual Fund Basics
//         </span>

//         <h4 className="text-[20px] font-semibold font-poppins leading-[30px] mb-2">
//           Mutual Funds vs Stock Trading – What's Better for You?
//         </h4>

//         <p className="text-[16px] font-inter font-medium">
//           Team Money Now &nbsp;|&nbsp; Dec 17, 2025, 09:33 AM
//         </p>
//       </div>

//       {/* Image */}
//  <div className="w-full">
//   <Image
//     src="/images/small-article-img1.png"
//     alt="Latest Article"
//     width={1200}
//     height={900}        // original image ratio
//     className="w-full h-auto rounded-[10px]"
//     priority
//   />
// </div>

//     </div>
//   ))}
// </div>
//  </div>

//           {/* RIGHT SECTION */}
//           <div className="lg:col-span-4">
//            <MostPopularBlogs/>

//             {/* Banner */}
//         <div className="relative w-full h-[620px] rounded ">
//   <Image
//     src="/images/blog-listing-right-banner.png"
//     alt="Banner"
//     fill
//     className=" rounded-lg"
//     priority
//   />
// </div>

//           </div>

//         </div>

//       {/* Second Banner Image */}
//       <div className="w-full">
//   <Image
//     src="/images/blog-listing-MF-sahi.png"
//     alt="Latest Article"
//     width={1200}
//     height={50}
//     sizes="(max-width: 768px) 100vw, 1200px"
//     className="w-full h-auto rounded"
//   />
// </div>

//       {/* Reserch Desk */}
//       <ResearchDesk/>

//       {/* Senior Citizen */}
//             <div className="w-full">
//   <Image
//     src="/images/senior-citizen-img.png"
//     alt="Latest Article"
//     width={1200}
//     height={50}
//     sizes="(max-width: 768px) 100vw, 1200px"
//     className="w-full h-auto rounded"
//   />
// </div>
// </div>
//  </section>

// <div className="w-full">
//   <HomeInvestTrack data={homeInvestTrackData} />

//   {/* Border only for StayConnected */}
//   <div className="border-t border-[#E5E7EB]">
//     <StayConnected />
//   </div>
// </div>

//     </>
  



//   );
// };

// export default LatestArticle;




"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import MostPopularBlogs from "@/components/blog-listing/MostPopularBlogs";
import ResearchDesk from "@/components/blog-listing/ResearchDesk";
import HomeInvestTrack from "@/components/home/home-invest-track";
import StayConnected from "@/components/home/stay-connected";
import { homeInvestTrackData } from "@/data/homePageData";

const LatestArticle = () => {
  return (
    <>
      {/* MAIN SECTION */}
      <section className="font-poppins w-full py-6 mb-[30px] md:mb-[120px] mb-[100px]  overflow-x-hidden">
        {/* Container */}
        <div className="max-w-full mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-[30px]">

            {/* LEFT SECTION */}
            <div className="lg:col-span-8 lg:border-r lg:border-[#F0F0F0] lg:pr-[24px]">
              <div className="border-b border-[#F0F0F0] mb-[30px]">

                <p className="text-[30px] font-poppins font-semibold mb-4 border-b border-[#F0F0F0] pb-[15px]">
                  Latest Articles
                </p>

                <div className="relative">
                  <span className="text-[20px] font-inter text-[#043F79] font-bold">
                    Mutual Fund Basics
                  </span>

                  <h3 className="text-[30px] font-semibold mt-1 mb-1">
                    What is a Mutual Fund?
                  </h3>

                  <p className="text-[16px] font-medium font-inter mb-[25px]">
                    Team Money Now &nbsp;|&nbsp; Dec 17, 2025, 09:33 AM
                  </p>
                </div>

                {/* Featured Article */}
                <div className="bg-white rounded mb-[20px]">
                  <Image
                    src="/images/article-img-1.png"
                    alt="Latest Article"
                    width={1200}
                    height={450}
                    className="w-full h-auto rounded mb-[20px]"
                    priority
                  />

                  <p className="text-[18px] leading-[28px] font-inter">
                    If you’ve ever wondered how to invest without tracking individual stocks
                    or learning complex financial jargon, mutual funds might be your answer.
                  </p>
                </div>
              </div>

              {/* Small Articles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2].map((item) => (
                  <div key={item} className="bg-white">

                    <div className="mb-5">
                      <span className="block text-[18px] font-bold font-inter text-[#043F79] mb-2">
                        Mutual Fund Basics
                      </span>

                      <h4 className="text-[20px] font-semibold font-poppins leading-[30px] mb-2">
                        Mutual Funds vs Stock Trading – What's Better for You?
                      </h4>

                      <p className="text-[16px] font-inter font-medium">
                        Team Money Now &nbsp;|&nbsp; Dec 17, 2025, 09:33 AM
                      </p>
                    </div>

                    <div className="w-full">
                      <Image
                        src="/images/small-article-img1.png"
                        alt="Latest Article"
                        width={1200}
                        height={900}
                        className="w-full h-auto rounded-[10px]"
                        priority
                      />
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT SECTION */}
            <div className="lg:col-span-4">
              <MostPopularBlogs />

              <div className="relative w-full rounded">
                <Image
                  src="/images/blog-listing-right-banner2.png"
                  alt="Banner"
                  width={1200}
                height={620}
                sizes="(max-width: 768px) 100vw, 1200px"
                className="w-full h-auto rounded"
                />
              </div>
              
            </div>

            
          </div>

          {/* Second Banner */}
          {/* <div className="w-full">
            <Image
              src="/images/blog-listing-MF-sahi.png"
              alt="Latest Article"
              width={1200}
              height={50}
              sizes="(max-width: 768px) 100vw, 1200px"
              className="w-full h-auto rounded"
            />
          </div> */}

          {/* Desktop / Tablet Image */}
<div className="hidden sm:block w-full">
  <Image
    src="/images/blog-listing-MF-sahi.png"
    alt="Latest Article"
    width={1200}
    height={50}
    sizes="(min-width: 640px) 1200px"
    className="w-full h-auto rounded"
  />
</div>

{/* Mobile Image */}
<div className="block sm:hidden w-full">
  <Image
    src="/images/blog-listing-MF-sahi-mb.png"
    alt="Latest Article Mobile"
    width={640}
    height={200}
    sizes="100vw"
    className="w-full h-auto rounded"
  />
</div>


          {/* Research Desk */}
          <ResearchDesk />

          {/* Senior Citizen */}
        {/* Desktop / Tablet Image */}
<div className="hidden sm:block w-full">
  <Image
    src="/images/senior-citizen-img.png"
    alt="Senior Citizen"
    width={1200}
    height={200}
    sizes="(min-width: 640px) 1200px"
    className="w-full h-auto rounded"
    priority
  />
</div>

{/* Mobile Image */}
<div className="block sm:hidden w-full">
  <Image
    src="/images/senior-citizen-img-mb.png"
    alt="Senior Citizen Mobile"
    width={640}
    height={300}
    sizes="100vw"
    className="w-full h-auto rounded"
    priority
  />
</div>


        </div>
      </section>

      {/* INVEST TRACK + STAY CONNECTED */}
      <div className="w-full ">
        <HomeInvestTrack data={homeInvestTrackData} />

        <div className="border-t border-[#E5E7EB]">
          <StayConnected />
        </div>
      </div>
    </>
  );
};

export default LatestArticle;
