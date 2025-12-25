import React from "react";
import Image from "next/image";

import bgDesktop from "@/app/assets/Coming-Soon.jpg";
import bgMobile from "@/app/assets/Coming-Soon-mb.jpg";

const ComingSoon: React.FC = () => {
  return (
    <section className="w-screen h-screen overflow-hidden">
      
      {/* Desktop */}
      <div className="hidden sm:block w-full h-full ">
        <Image
          src={bgDesktop}
          alt="Coming Soon Desktop"
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Mobile */}
      <div className="sm:hidden w-full h-full">
        <Image
          src={bgMobile}
          alt="Coming Soon Mobile"
          className="w-full h-full object-contain"
          priority
        />
      </div>

    </section>
  );
};

export default ComingSoon;
