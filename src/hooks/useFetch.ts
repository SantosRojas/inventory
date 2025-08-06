import { useState, useCallback, useRef } from "react";
import { getHeaders } from "../utils/headersUtil.ts";

type Data<T> = T | null;
type ErrorType = string | null;

interface Params<T> {
  data: Data<T>;
  loadingSearch: boolean;
  searchError: ErrorType;
  fetchData: (url: string) => void;
}

interface UseFetchOptions extends RequestInit {
  onError?: (error: string) => void;
}

export const useFetch = <T>(
  token?: string | null,
  options?: UseFetchOptions
): Params<T> => {
  const [data, setData] = useState<Data<T>>(null);
  const [loadingSearch, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<ErrorType>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(
    async (url: string) => {
      controllerRef.current?.abort();
      controllerRef.current = new AbortController();

      setLoading(true);
      setSearchError(null);

      try {
        const response = await fetch(url, {
          signal: controllerRef.current.signal,
          headers: {
            ...getHeaders(token || ""),
            ...(options?.headers || {}),
          },
          ...options,
        });

        if (!response.ok) {
          const errorMessage = `HTTP ${response.status}: ${response.statusText}`;
          setSearchError(errorMessage);
          setData(null);
          options?.onError?.(errorMessage);
          return;
        }

        const jsonData = await response.json();

        if (jsonData.success) {
          setData(jsonData.data);
        } else {
          const errorMessage =
            jsonData.error || jsonData.message || "Error desconocido";
          setSearchError(errorMessage);
          setData(null);
          options?.onError?.(errorMessage);
          return;
        }
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // Ignorar abortos
          return;
        }

        const errorMessage =
          err instanceof Error ? err.message : "Error desconocido";
        setSearchError(errorMessage);
        setData(null);
        options?.onError?.(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [token, options]
  );

  return { data, loadingSearch, searchError, fetchData };
};
