"use client";
import { useEffect } from "react";
import { useLoadingStore } from "@/app/store/loadingStore";

export default function SetTitle({ title }) {
  const { setTitle } = useLoadingStore();

  useEffect(() => {
    setTitle(title);
  }, [title, setTitle]);

  return null;
}
