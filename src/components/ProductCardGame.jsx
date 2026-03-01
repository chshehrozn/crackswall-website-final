"use client";

import Link from "next/link";
import Image from "next/image";
import { useLoadingStore } from "@/app/store/loadingStore";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/context/TranslationContext";

export default function ProductCardGame({ gameCategoryBlogs, locale = 'en' }) {
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const theme = useTheme();
  const dictionary = useTranslation();
  return (
    <div className="transition-all duration-300" suppressHydrationWarning>
      <div className="border-b border-solid mb-4 pb-6">
        <h3 className="text-xl font-bold">
          {gameCategoryBlogs?.category?.title || ""}
        </h3>
      </div>
      <div className="flex flex-col gap-4">
        {gameCategoryBlogs?.data?.data.length ? (
          <>
            {gameCategoryBlogs?.data?.data
              ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
              ?.slice(0, 10)
              ?.map((item, index) => (
                <div key={index} className="flex w-full gap-3">
                  <Image
                    src={item?.software_image?.startsWith('http') ? item.software_image : `${process.env.NEXT_PUBLIC_WEB_URL}/${item?.software_image?.replace(/^public\//, '')}`}
                    alt="logo of software"
                    width={65}
                    height={65}
                  />
                  <div className="flex flex-col">
                    <Link
                      href={`/${locale}/${item?.category?.slug}/${item?.slugs}`}
                      onClick={() => setIsLoading(true)}
                      className="text-[#2b373a] cursor-pointer block text-sm font-bold 1overflow-hidden 1text-ellipsis 1whitespace-nowrap"
                    >
                      {item.software_name || "-"}
                    </Link>
                    <Link
                      href={`/${locale}/${gameCategoryBlogs?.category?.slug}`}
                      onClick={() => setIsLoading(true)}
                      className="text-[#00856f] text-xs font-bold mb-[2px]"
                    >
                      {gameCategoryBlogs?.category?.title || "-"}
                    </Link>
                    <div className="text-[#2b373a] text-start font-bold text-lg uppercase" suppressHydrationWarning>
                      {item?.file_size?.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
          </>
        ) : (
          <p className="text-sm">{dictionary?.data_not_found || "Data not found!"}</p>
        )}
      </div>
    </div>
  );
}
