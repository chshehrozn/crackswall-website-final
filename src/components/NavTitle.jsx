"use client";
import { useLoadingStore } from "@/app/store/loadingStore";

export default function NavTitle() {
  const { title } = useLoadingStore();
  return (
    <>
      {title === undefined || title === null || title === "" ? null : (
        <div className="title-header flex items-center">
          <h1 className="margins w-full capitalize text-2xl font-semibold">
            {title}
          </h1>
        </div>
      )}
    </>
  );
}
