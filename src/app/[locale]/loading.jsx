"use client";

import { useEffect } from "react";
import { useLoadingStore } from "@/app/store/loadingStore";

export default function Loading() {
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);

  useEffect(() => {
    setIsLoading(true); // Start loading when this component is mounted

    return () => {
      setIsLoading(false); // Stop loading when this component is unmounted
    };
  }, [setIsLoading]);

  return <div className="min-h-screen" />;
}
