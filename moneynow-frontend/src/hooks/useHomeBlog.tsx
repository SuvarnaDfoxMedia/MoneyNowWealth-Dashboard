import { useState, useEffect } from "react";
import API from "@/app/api/axios";

export interface CardData {
  imageSrc: string;
  category: string;
  title: string;
  description: string;
}

export const useFetchCards = (endpoint: string) => {
  const [cards, setCards] = useState<CardData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const { data } = await API.get(endpoint);

        if (!data.success || !Array.isArray(data.clusters)) {
          setCards([]);
          return;
        }

        // Convert clustered topics → flat list
        const allTopics = data.clusters.flatMap((cluster: any) =>
          cluster.topics.map((topic: any) => ({
            ...topic,
            clusterTitle: cluster.title,
          }))
        );

        // Filter published + active
        const publishedTopics = allTopics.filter(
          (t: any) => t.status === "published" && t.is_active === 1
        );

        // Sort by latest
        publishedTopics.sort(
          (a: any, b: any) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );

        // Take 3
        const latestThree = publishedTopics.slice(0, 3);

        // Convert into card format
        const formattedCards = latestThree.map((topic: any) => {
          const article = topic.articles?.[0];

          let imageSrc = "/no-image.png";
          if (article?.hero_image) {
            const fileName = article.hero_image.replace(/\\/g, "/").split("/").pop();
            imageSrc = `${API.defaults.baseURL}/uploads/hero/${fileName}`;
          }

          const description = article
            ? article.introduction.replace(/<[^>]+>/g, "")
                .split(" ")
                .slice(0, 30)
                .join(" ") + "..."
            : "";

          return {
            imageSrc,
            category: topic.clusterTitle,
            title: topic.title,
            description,
          };
        });

        setCards(formattedCards);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]); // Dependency → refetch if endpoint changes

  return { cards, loading, error };
};
