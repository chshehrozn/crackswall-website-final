"use client";
import StarRating from "@/components/StarRating";
import { decodeHtmlEntities } from "@/utils/common";
import Link from "next/link";
import Image from "next/image";
import { useLoadingStore } from "@/app/store/loadingStore";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "@/context/TranslationContext";

import { CloudDownloadIcon, MacIcon, MSWindowIcon, PcGameIcon } from "@/icons";

const ProductCard = ({ data, slug, locale = 'en' }) => {
  const theme = useTheme();
  const router = useRouter();
  const dictionary = useTranslation();
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);
  const subCategoryClick = (data) => {
    setIsLoading(true);
    router.push(`/${locale}/${data?.category?.slug}/${data?.subcategory?.slug}`);
  };

  return (
    <div className="flex bg-white sm:flex-row flex-col sm:gap-0 gap-3 p-3 border border-solid transition-colors duration-300"
      style={{ borderColor: theme?.productCard?.borderColor || '#ebebeb' }}
      suppressHydrationWarning>
      <div className="flex items-center flex-1 gap-3">
        <Link
          href={`/${locale}/${data?.category?.slug}/${data?.slugs}`}
          onClick={() => setIsLoading(true)}
        >
          <img
            src={data?.soft_image?.startsWith('http') ? data.soft_image : `${process.env.NEXT_PUBLIC_WEB_URL}/${data?.soft_image?.replace(/^public\//, '')}`}
            alt={data?.title || "Product Image"}
            width={65}
            height={65}
          />
        </Link>

        <div className="flex flex-col">
          <Link
            href={`/${locale}/${data?.category?.slug}/${data?.slugs}`}
            className="text-[#2b373a] cursor-pointer block text-base font-semibold text-start"
          >
            {data.software_name || "-"} {data.software_version || "-"}
          </Link>
          <p className="text-[#666] text-xs font-normal">
            {data.software_description?.slice(0, 45) +
              (data.software_description?.length > 45 ? "..." : "")}
          </p>
          <button
            className="text-[#00856f] text-xs font-medium text-start"
            onClick={(e) => {
              subCategoryClick(data);
            }}
          >
            {data?.subcategory
              ? decodeHtmlEntities(data?.subcategory.title)
              : "-"}
          </button>
        </div>
      </div>
      <div className="flex sm:flex-col flex-row items-center sm:justify-center justify-between sm:px-5 px-0 gap-2 border-l border-solid border-[#ebebeb]">
        <Link
          href={`/${locale}/${data?.category?.slug}`}
          className="flex items-center justify-start gap-3"
        >
          <div className="flex items-center justify-center h-5 w-5">
            {data?.operating_system === "Windows" ? (
              <MSWindowIcon />
            ) : data?.operating_system === "PC Games" ? (
              <PcGameIcon />
            ) : (
              <MacIcon />
            )}
          </div>
          <span className="text-[#2b373a] text-xs font-semibold capitalize">
            {data?.operating_system || "-"}
          </span>
        </Link>
        <div className="flex items-center justify-start gap-1">
          <div className="flex items-center justify-center h-3 w-3">
            <CloudDownloadIcon />
          </div>
          <span className="text-[#666] text-[11px] font-semibold capitalize">
            {data?.review_count || "00"}
          </span>
        </div>
      </div>
      <div className="flex items-center sm:pl-5 pl-0 flex-[0.6] gap-2 border-l border-solid border-[#ebebeb]">
        {theme?.productCard?.showRating !== false && (
          <div className="flex sm:items-center items-start justify-center flex-1 flex-col gap-2">
            <div className="text-[#2b373a] text-center font-semibold text-xs" suppressHydrationWarning>
              {dictionary?.reputation || "Reputation"}
            </div>
            <StarRating initialRating={data?.rating_value} slug={data?.slugs} />
          </div>
        )}
        <div className="flex flex-1 sm:items-center items-end justify-center flex-col gap-2 pl-5 border-l border-solid border-[#ebebeb] h-full">
          <div className="text-[#2b373a] text-center font-semibold text-xl uppercase" suppressHydrationWarning>
            {data?.file_size?.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductCard;
