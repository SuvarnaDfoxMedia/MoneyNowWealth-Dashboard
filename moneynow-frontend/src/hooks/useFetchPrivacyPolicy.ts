import { useState, useEffect } from "react";
import API from "@/app/api/axios";

export interface Section {
  title: string;
  content: string;
}

export interface CmsPage {
  title: string;
  slug: string;
  sections: Section[];
}

export const useFetchPrivacyPolicy = () => {
  const [page, setPage] = useState<CmsPage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        setLoading(true);

        const { data } = await API.get("/api/cmspages?slug=privacy-policy");

        if (!data.success || !Array.isArray(data.pages)) {
          setError("Invalid response format");
          return;
        }

        const policy = data.pages.find((p: any) => p.slug === "privacy-policy");

        if (!policy) {
          setError("Privacy Policy not found");
          return;
        }

        setPage(policy);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPage();
  }, []);

  return { page, loading, error };
};
