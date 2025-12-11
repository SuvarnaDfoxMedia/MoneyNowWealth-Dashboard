// "use client";

// import React from "react";
// import SipBarChart from "@/components/SipBarChart";
// import { homeCalculatorsData } from "@/data/homePageData";

// const HomeCalculators = () => {
//   const {
//     title,
//     subtitle,
//     tabs,
//     investmentTypes,
//     sliders,
//     futureValue,
//     ctaCard,
//     breakdown,
//     footer,
//   } = homeCalculatorsData;

//   return (
//     <div className="bg-[#F4F9FF] min-h-screen font-sans text-gray-800 pt-8 pb-6">
//       <div className="container mx-auto px-4">

//         {/* HEADER */}
//         <div className="text-center mb-6 mx-auto">
//           <h2 className="font-bold text-3xl sm:text-4xl mb-2">{title}</h2>
//           <p className="text-gray-600 text-base sm:text-lg mt-2">{subtitle}</p>
//         </div>

//         {/* TABS */}
// <div className="max-w-6xl mx-auto border-b border-gray-200 mb-6">
//   <div className="flex max-w-6xl mx-auto">
//     {tabs.map((t, i) => (
//       <button
//         key={i}
//         className={`relative px-12 py-4 text-[16px] font-medium 
//           ${i === 0 ? "text-[#043F79]" : "text-gray-600 hover:text-blue-600"}
//         `}
//       >
//         {t}

//         {/* underline ONLY for active tab */}
//         {i === 0 && (
//           <span className="absolute left-0 bottom-0 h-[3px] w-full bg-blue-900" />
//         )}
//       </button>
//     ))}
//   </div>
// </div>



//         {/* MAIN BOX */}
//         <div className="bg-[#E6F2FE] border border-gray-200  rounded-[10px]  sm:p-10 max-w-6xl mx-auto">

//           {/* Section Title */}
//          <h2 className="text-[24px] sm:text-[32px] font-semibold mb-6 text-gray-800">
//   Calculate the future value of your SIP investment
// </h2>


//           {/* RADIO OPTIONS */}
//           <div className="flex flex-wrap gap-6 mb-8">
//             {investmentTypes.map((item) => (
//               <label key={item.id} className="flex items-center space-x-2 cursor-pointer">
//                 <input
//                   type="radio"
//                   name="investmentType"
//                   defaultChecked={item.checked}
//                   className="h-4 w-4 text-[#043F79]"
//                 />
//                 <span className="text-gray-700">{item.label}</span>
//               </label>
//             ))}
//           </div>

//        {/* SLIDERS */}
// <div className="flex flex-col sm:flex-row gap-6 mb-12">
//   {sliders.map((slider, idx) => (
//     <div key={idx} className="flex-1 flex flex-col">
//       {/* Label and Display Value on same row */}
//       <div className="flex justify-between mb-5">
//         <span className="text-gray-600 font-medium">{slider.label}</span>
//        <span className="text-lg font-medium underline underline-offset-8 decoration-[#717171]">
//   {slider.display}
// </span>

//       </div>

//       {/* Slider input */}
//       <input
//         type="range"
//         min={slider.min}
//         max={slider.max}
//         defaultValue={slider.value}
//         className="w-full accent-[#043F79]"
//       />
//     </div>
//   ))}
// </div>


//           {/* CHART + RIGHT SIDE */}
//         <div className="flex flex-col lg:flex-row rounded-[10px] p-4 bg-[#ffffff]">

//   {/* LEFT CHART */}
//   <div className="lg:w-6/12  p-4 bg-white">
//     <div className="relative">
//       <p className="absolute top-5 right-2 font-semibold text-gray-800 text-lg">
//         ₹85.11 Lacs
//       </p>

//       {/* Chart component */}
//       <SipBarChart
//         invested={[5, 7, 9, 12, 15, 18, 22, 26, 30]}
//         returns={[1, 2, 3, 5, 8, 12, 17, 23, 30]}
//       />
//     </div>
//   </div>

//   {/* RIGHT SIDE PANEL */}
//   <div className="lg:w-6/12 space-y-6 border border-gray-200 rounded-lg p-6 ">

//     {/* FUTURE VALUE */}
//     <div className="flex justify-between">
//       <span className="text-[#6A6A6A]  font-semibold text-[16px]">Future value</span>
//       <span className="text-[#043F79] text-[20px] font-bold">₹85.11 Lacs</span>
//     </div>

//     {/* CTA CARD */}
//     <div className="bg-blue-50 border border-blue-200 rounded-lg py-8 px-4 flex items-center gap-4">

//       {/* TEXT BLOCK */}
//       <div className="flex-1">
//         <p className="font-bold text-[#000000] text-[20px] mb-4">
//           Top 10% of investors
//         </p>
//         <p className="text-[#6A6A6A] text-[16px] mb-2">
//           consistently generate more than 15% return
//         </p>

//         <button className="mt-3 bg-[#043F79] text-white px-8 py-3 text-[15px] font-medium rounded-[5px]">
//           I WANT TO BE IN TOP 10%
//         </button>
//       </div>

//       {/* IMAGE */}
//       <img
//         src="/images/future-value.png"
//         alt="investment-growth"
//         className="w-24 h-24 object-contain"
//       />
//     </div>

//     {/* BREAKDOWN */}
//     <div className="space-y-3 pt-4">
//       <div className="flex justify-between">
//         <span className="text-[#6A6A6A] text-[16px]">Total Invested</span>
//         <span className="text-[18px] font-bold text-[#000000]">₹15 Lacs</span>
//       </div>

//       <div className="flex justify-between">
//         <span className="text-[#6A6A6A] text-[16px]">Estimated returns</span>
//         <span className="text-[18px] font-bold text-[#000000]">₹70.11 Lacs</span>
//       </div>
//     </div>
//   </div>

// </div>

//         </div>

//         {/* FOOTER */}
//         <p className="text-center text-[#6A6A6A] mt-6 text-[18px] font-medium">{footer}</p>
//       </div>
//     </div>
//   );
// };

// export default HomeCalculators;


"use client";
import Image from "next/image";
import React from "react";
import SipBarChart from "@/components/home/SipBarChart";
import { homeCalculatorsData } from "@/data/homePageData";

const HomeCalculators = () => {
  const {
    title,
    subtitle,
    tabs,
    investmentTypes,
    sliders,
    futureValue,
    ctaCard,
    breakdown,
    footer,
  } = homeCalculatorsData;

  return (
    <div className="bg-[#F4F9FF] min-h-screen font-sans text-gray-800 pt-8 pb-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* HEADER */}
        <div className="text-center mb-6 mx-auto">
          <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-2">{title}</h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg mt-2">{subtitle}</p>
        </div>

        {/* TABS */}
        <div className="max-w-full sm:max-w-6xl mx-auto border-b border-gray-200 mb-6 overflow-x-auto">
          <div className="flex w-max">
            {tabs.map((t, i) => (
              <button
                key={i}
                className={`relative px-6 sm:px-12 py-2 sm:py-4 text-[14px] sm:text-[16px] font-medium whitespace-nowrap
                  ${i === 0 ? "text-[#043F79]" : "text-gray-600 hover:text-blue-600"}
                `}
              >
                {t}

                {/* underline ONLY for active tab */}
                {i === 0 && (
                  <span className="absolute left-0 bottom-0 h-[2px] sm:h-[3px] w-full bg-blue-900" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN BOX */}
<div className="bg-[#E6F2FE] border border-gray-200 rounded-[10px] p-4 sm:p-6 md:p-10 max-w-full sm:max-w-6xl mx-auto">

          {/* Section Title */}
          <h2 className="text-[20px] sm:text-[24px] md:text-[32px] font-semibold mb-6 text-gray-800 text-center sm:text-left">
            Calculate the future value of your SIP investment
          </h2>

          {/* RADIO OPTIONS */}
          <div className="flex flex-wrap gap-4 sm:gap-6 mb-8 justify-center sm:justify-start">
            {investmentTypes.map((item) => (
              <label key={item.id} className="flex items-center space-x-2 cursor-pointer text-sm sm:text-base">
                <input
                  type="radio"
                  name="investmentType"
                  defaultChecked={item.checked}
                  className="h-4 w-4 sm:h-5 sm:w-5 text-[#043F79]"
                />
                <span className="text-gray-700">{item.label}</span>
              </label>
            ))}
          </div>

          {/* SLIDERS */}
          <div className="flex flex-col sm:flex-row gap-6 mb-8">
            {sliders.map((slider, idx) => (
              <div key={idx} className="flex-1 flex flex-col">
                <div className="flex justify-between mb-3 sm:mb-5 text-sm sm:text-base">
                  <span className="text-gray-600 font-medium">{slider.label}</span>
                  <span className="text-[14px] sm:text-lg font-medium underline underline-offset-4 sm:underline-offset-8 decoration-[#717171]">
                    {slider.display}
                  </span>
                </div>
                <input
                  type="range"
                  min={slider.min}
                  max={slider.max}
                  defaultValue={slider.value}
                  className="w-full accent-[#043F79]"
                />
              </div>
            ))}
          </div>

          {/* CHART + RIGHT PANEL */}
          <div className="flex flex-col lg:flex-row rounded-[10px] p-4 sm:p-6 bg-[#ffffff] gap-6 sm:gap-8">

            {/* LEFT CHART */}
            <div className="lg:w-6/12 p-2 sm:p-4 bg-white relative">
              <p className="absolute top-2 sm:top-5 right-2 sm:right-4 font-semibold text-gray-800 text-[16px] sm:text-lg">
                ₹85.11 Lacs
              </p>

              <SipBarChart
                invested={[5, 7, 9, 12, 15, 18, 22, 26, 30]}
                returns={[1, 2, 3, 5, 8, 12, 17, 23, 30]}
              />
            </div>

            {/* RIGHT PANEL */}
            <div className="lg:w-6/12 flex flex-col gap-4 sm:gap-6 border border-gray-200 rounded-lg p-4 sm:p-6">

              {/* FUTURE VALUE */}
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-[#6A6A6A] font-semibold">Future value</span>
                <span className="text-[#043F79] text-[16px] sm:text-[20px] font-bold">₹85.11 Lacs</span>
              </div>

              {/* CTA CARD */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg py-4 sm:py-8 px-3 sm:px-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                <div className="flex-1 text-center sm:text-left">
                  <p className="font-bold text-[#000000] text-[16px] sm:text-[20px] mb-2 sm:mb-4">
                    Top 10% of investors
                  </p>
                  <p className="text-[#6A6A6A] text-[14px] sm:text-[16px] mb-2">
                    consistently generate more than 15% return
                  </p>
                  <button className="mt-2 sm:mt-3 bg-[#043F79] text-white px-5 sm:px-8 py-2 sm:py-3 text-[13px] sm:text-[15px] font-medium rounded-[5px]">
                    I WANT TO BE IN TOP 10%
                  </button>
                </div>

             <Image
  src="/images/future-value.png"
  alt="investment-growth"
  width={96}       // 24 * 4 (tailwind w-24 = 6rem = 96px)
  height={96}      // 24 * 4
  className="object-contain"
/>
              </div>

              {/* BREAKDOWN */}
              <div className="space-y-2 sm:space-y-3 pt-2 sm:pt-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-[#6A6A6A]">Total Invested</span>
                  <span className="text-[16px] sm:text-[18px] font-bold text-[#000000]">₹15 Lacs</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-[#6A6A6A]">Estimated returns</span>
                  <span className="text-[16px] sm:text-[18px] font-bold text-[#000000]">₹70.11 Lacs</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* FOOTER */}
        <p className="text-center text-[#6A6A6A] mt-4 sm:mt-6 text-[16px] sm:text-[18px] font-medium">{footer}</p>
      </div>
    </div>
  );
};

export default HomeCalculators;
