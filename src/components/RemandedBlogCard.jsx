"use client";
import Link from "next/link";
import Image from "next/image";
import { useLoadingStore } from "@/app/store/loadingStore";
import { useTheme } from "@/context/ThemeContext";

export default function RemandedBlogCard({ item, subCategoryData, locale = 'en' }) {
  const theme = useTheme();
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  return (
    <div className="flex bg-white flex-row gap-3 p-3 border border-solid transition-colors duration-300 overflow-hidden relative"
      style={{ borderColor: theme?.productCard?.borderColor || '#ebebeb' }}
      suppressHydrationWarning>
      <Link
        href={`/${locale}/${item?.category?.slug}/${item?.slugs}`}
        onClick={() => setIsLoading(true)}
      >
        <Image
          src={item?.soft_image?.startsWith('http') ? item.soft_image : `${process.env.NEXT_PUBLIC_WEB_URL}/${item?.soft_image?.replace(/^public\//, '')}`}
          alt="logo of software"
          width={65}
          height={65}
        />
      </Link>
      <div className="flex flex-col">
        <Link
          href={`/${locale}/${item?.category?.slug}/${item?.slugs}`}
          onClick={() => setIsLoading(true)}
          className="text-[#2b373a] cursor-pointer block text-sm font-bold 1overflow-hidden 1text-ellipsis 1whitespace-nowrap"
        >
          {item.software_name || "-"}
        </Link>
        <Link
          href={`/${locale}/${subCategoryData?.category?.slug}`}
          onClick={() => setIsLoading(true)}
          className="text-[#00856f] text-xs font-bold mb-[2px]"
        >
          {subCategoryData?.category?.title || "-"}
        </Link>
        <div className="text-[#2b373a] text-start font-bold text-[10px] uppercase" suppressHydrationWarning>
          {item?.file_size?.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
