"use client";

import { useEffect, useRef } from "react";
import LoadingBar from "react-top-loading-bar";
import { useLoadingStore } from "@/app/store/loadingStore";

export default function Loader() {
  const loadingBarRef = useRef(null);
  const isLoading = useLoadingStore((state) => state.isLoading);

  useEffect(() => {
    if (isLoading) {
      loadingBarRef.current?.continuousStart();
    } else {
      loadingBarRef.current?.complete();
    }
  }, [isLoading]);

  return <LoadingBar color="#00856f" ref={loadingBarRef} shadow={true} height={3} />;
}
