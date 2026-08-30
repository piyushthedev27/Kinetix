"use client";

import { useEffect, useRef, useState } from "react";

interface AsyncDataState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Fetches data from any lib/data provider call and exposes a clean
 * loading/error/data state. Works identically whether the underlying
 * provider is the mock (setTimeout-based) or a real fetch() call later
 * — components never need to change when the data source changes.
 */
export function useAsyncData<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<AsyncDataState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    fetcherRef
      .current()
      .then((data) => {
        if (!cancelled) setState({ data, isLoading: false, error: null });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Something went wrong loading this.";
          setState({ data: null, isLoading: false, error: message });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}
