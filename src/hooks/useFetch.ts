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

export const useFetch = <T>(token?: string | null, options?: RequestInit): Params<T> => {
    const [data, setData] = useState<Data<T>>(null);
    const [loadingSearch, setLoading] = useState(false);
    const [searchError, setSearchError] = useState<ErrorType>(null);
    const controllerRef = useRef<AbortController | null>(null);

    const fetchData = useCallback(async (url: string) => {
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
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const jsonData = await response.json();

            if (jsonData.success) {
                setData(jsonData.data);
            } else {
                throw new Error(jsonData.error || jsonData.message || "Error desconocido");
            }

        } catch (err) {
            if (err instanceof Error && err.name !== "AbortError") {
                setSearchError(err.message);
                setData(null);
            }
        } finally {
            setLoading(false);
        }
    }, [token, options]);

    return { data, loadingSearch, searchError, fetchData };
};
