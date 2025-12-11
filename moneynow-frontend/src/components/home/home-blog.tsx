// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";

// // ------------------ TYPES ---------------------

// interface Article {
//   hero_image: string;
//   introduction: string;
//   created_at: string;
// }

// interface Topic {
//   title: string;
//   status: string;
//   is_active: number;
//   created_at: string;
//   articles: Article[];
// }

// interface Cluster {
//   title: string;
//   topics: Topic[];
// }

// interface FlattenedTopic extends Topic {
//   clusterTitle: string;
// }

// interface CardData {
//   imageSrc: string;
//   category: string; // cluster title
//   title: string;
//   description: string;
// }

// interface HomeBlogProps {
//   title: string;
//   subtitle: string;
// }

// // ------------------------------------------------

// const HomeBlog: React.FC<HomeBlogProps> = ({ title, subtitle }) => {
//   const [cards, setCards] = useState<CardData[]>([]);
//   const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000";

//   useEffect(() => {
//     const fetchTopics = async () => {
//       try {
//         const res = await fetch(`${API_BASE}/api/topic/published`);
//         const data = await res.json();

//         if (data.success && Array.isArray(data.clusters)) {
//           const clusters: Cluster[] = data.clusters;

//           // Flatten topics and attach clusterTitle
//           const allTopics: FlattenedTopic[] = clusters.flatMap((cluster) =>
//             cluster.topics.map((topic) => ({
//               ...topic,
//               clusterTitle: cluster.title,
//             }))
//           );

//           // Only active + published
//           const publishedTopics = allTopics.filter(
//             (t) => t.status === "published" && t.is_active === 1
//           );

//           // Sort latest first
//           publishedTopics.sort(
//             (a, b) =>
//               new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//           );

//           // Latest 3 only
//           const latestThree = publishedTopics.slice(0, 3);

//           // Convert into CardData[]
//           const cardsData: CardData[] = latestThree.map((topic) => {
//             const article = topic.articles?.[0];

//             // Build image URL
//             let imageSrc = "/no-image.png";
//             if (article?.hero_image) {
//               const fileName = article.hero_image.replace(/\\/g, "/").split("/").pop();
//               imageSrc = `${API_BASE}/uploads/hero/${fileName}`;
//             }

//             // Clean description text
//             const description = article
//               ? article.introduction
//                   .replace(/<[^>]+>/g, "")
//                   .split(" ")
//                   .slice(0, 30)
//                   .join(" ") + "..."
//               : "";

//             return {
//               imageSrc,
//               category: topic.clusterTitle,
//               title: topic.title,
//               description,
//             };
//           });

//           setCards(cardsData);
//         }
//       } catch (err) {
//         console.error("Error fetching topics:", err);
//       }
//     };

//     fetchTopics();
//   }, [API_BASE]);

//   return (
//     <section className="font-poppins pt-[25px] mb-[25px]">
//       <div className="max-w-7xl mx-auto ">
//         <h2 className="font-bold text-[24px] leading-[30px] sm:text-[32px] text-center mb-2">
//           {title}
//         </h2>

//         <p className="text-center text-[15px] text-[#6A6A6A] mb-[10px] max-w-2xl mx-auto">
//           {subtitle}
//         </p>

//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 ">
//           {cards.map((card, index) => (
//             <div key={index} className="bg-white rounded-xl p-4">
//               <div className="relative w-full h-56 rounded-sm overflow-hidden mb-[18px] cursor-pointer transition-transform hover:scale-[1.01]">
//                 <Image
//                   src={card.imageSrc}
//                   alt={card.title}
//                   fill
//                   className="object-cover"
//                   unoptimized
//                 />
//               </div>

//               {/* Cluster title */}
//               <div className="mb-[15px]">
//                 <span className="text-[12px] px-3 py-[6px] rounded-[8px] bg-[#F0F0F0] text-[#6A6A6A] font-medium">
//                   {card.category}
//                 </span>
//               </div>

//               {/* Topic title */}
//               <h3 className="font-semibold text-[18px] leading-[26px] mb-0 line-clamp-2">
//                 {card.title}
//               </h3>

//               {/* Description optionally */}
//               {/* <p className="text-[14px] text-[#6A6A6A] line-clamp-3 mb-0">
//                 {card.description}
//               </p> */}
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default HomeBlog;


"use client";
import React from "react";
import Image from "next/image";
import { useFetchCards } from "@/hooks/useHomeBlog";

interface HomeBlogProps {
  title: string;
  subtitle: string;
}

const HomeBlog: React.FC<HomeBlogProps> = ({ title, subtitle }) => {
  const { cards, loading, error } = useFetchCards("/api/topic/published");

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <section className="font-poppins pt-[25px] mb-[25px]">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-bold text-[24px] sm:text-[32px] text-center mb-2">
          {title}
        </h2>
        <p className="text-center text-[15px] text-[#6A6A6A] mb-[10px] max-w-2xl mx-auto">
          {subtitle}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl p-4">
              <div className="relative w-full h-56 rounded-sm overflow-hidden mb-[18px]">
                <Image
                  src={card.imageSrc}
                  alt={card.title}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <span className="text-[12px] px-3 py-[6px] rounded-[8px] bg-[#F0F0F0] text-[#6A6A6A] font-medium">
                {card.category}
              </span>

              <h3 className="font-semibold text-[18px] leading-[26px] mt-2 line-clamp-2">
                {card.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeBlog;
