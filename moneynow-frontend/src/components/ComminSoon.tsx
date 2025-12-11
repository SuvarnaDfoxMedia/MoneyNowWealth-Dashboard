import React from "react";
import Image from "next/image";

import bgDesktop from "@/app/assets/Coming-Soon.jpg";
import bgMobile from "@/app/assets/Coming-Soon-mb.jpg";
import ProgressBar from "@/app/assets/progress-bar.png";

const ComingSoon: React.FC = () => {
  return (
    <section className="relative w-full min-h-[580px]">

      {/* Desktop Background */}
      <div className="hidden sm:block absolute inset-0">
        <Image
          src={bgDesktop}
          alt="Background Desktop"
          fill
          className="object-cover"
        />
      </div>

      {/* Mobile Background */}
      <div className="sm:hidden absolute inset-0">
        <Image
          src={bgMobile}
          alt="Background Mobile"
          fill
        />
      </div>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-5">
        <h1 className="text-white text-3xl sm:text-[50px] font-semibold">
          Coming Soon...
        </h1>
<Image
  src={ProgressBar}
  alt="Progress Bar"
  className="w-[200px] sm:w-[320px] object-contain"
/>
      </div>
    </section>
  );
};

export default ComingSoon;
