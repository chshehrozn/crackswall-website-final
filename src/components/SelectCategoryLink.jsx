"use client";
import Link from "next/link";

export default function SelectCategoryLink({ item, index, categorySlug, locale = 'en' }) {
  return (
    <Link
      href={`/${locale}/${item.slug}`}
      key={index}
      className="flex items-center gap-3 w-full cursor-pointer py-1"
    >
      <input
        type="checkbox"
        checked={`${item.slug}` == categorySlug}
        readOnly
        className="h-4 w-4 rounded bg-[#ebebeb] cursor-pointer"
      />
      <label className="text-[#666] text-[13px] font-semibold cursor-pointer">
        {item.title}
      </label>
    </Link>
  );
}
