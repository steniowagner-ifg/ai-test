import { useCallback, useState } from "react";

type HttpMethod = "GET" | "DELETE" | "POST";

export const useFetch = <T = unknown>(
  endpoint: string,
  httpMethod: HttpMethod = "GET"
) => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const doFetch = useCallback(
    async (body?: unknown) => {
      try {
        setIsLoading(true);
        setHasError(false);
        const options: RequestInit = {
          method: httpMethod,
          headers: {},
        };
        if (httpMethod === "POST" || httpMethod === "DELETE") {
          if (body instanceof FormData) {
            options.body = body; // Let browser set multipart boundary
          } else {
            options.body = JSON.stringify(body ?? {});
            options.headers = {
              ...options.headers,
              "Content-Type": "application/json",
            };
          }
        }
        const response = await fetch(`/api/${endpoint}`, options);
        if (!response.ok) {
          setHasError(true);
          return;
        }
        const data = await response.json();
        setData(data);
      } catch (err) {
        console.error(err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [httpMethod, endpoint]
  );

  return { data, isLoading, hasError, fetch: doFetch };
};
