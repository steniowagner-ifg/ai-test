import { useCallback, useState } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export const useFetch = <T = unknown>(endpoint: string) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const fetch = useCallback(
    async (params?: URLSearchParams) => {
      try {
        setIsLoading(true);
        setHasError(false);
        const response = await api.get<T>(endpoint, {
          params,
        });
        setData(response.data);
      } catch (err) {
        console.error(err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [endpoint]
  );

  return { data, isLoading, hasError, fetch };
};
