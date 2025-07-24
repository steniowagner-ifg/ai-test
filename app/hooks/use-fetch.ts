import { useCallback, useState } from "react";

type HttpMethod = "GET" | "DELETE";

export const useFetch = <T = unknown>(
  endpoint: string,
  httpMethod: HttpMethod = "GET"
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const doFetch = useCallback(async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      const response = await fetch(`/api/${endpoint}`, {
        method: httpMethod,
      })
        .then((response) => response.json())
        .then((response) => ({ data: response }));
      setData(response.data);
    } catch (err) {
      console.error(err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [httpMethod, endpoint]);

  return { data, isLoading, hasError, fetch: doFetch };
};
