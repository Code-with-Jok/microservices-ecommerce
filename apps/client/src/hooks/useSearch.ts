import { useSearchParams, useRouter } from "next/navigation";
import { useState, useCallback } from "react";

export const useSearch = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState<string>(
    searchParams.get("search") || ""
  );

  const handleSearch = useCallback(
    (query?: string) => {
      const targetQuery = query ?? search;
      const params = new URLSearchParams(searchParams.toString());

      if (targetQuery.trim()) {
        params.set("search", targetQuery.trim());
      } else {
        params.delete("search");
      }

      router.push(`/products?${params.toString()}`);
    },
    [search, searchParams, router]
  );

  return {
    search,
    setSearch,
    handleSearch,
  };
};
