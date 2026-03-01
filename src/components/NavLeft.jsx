"use client";

import Link from "next/link";
import Image from "next/image";
import SearchBox from "@/components/SearchBox";
import { useTheme } from "@/context/ThemeContext";
import { useParams } from "next/navigation";

export default function NavLeft() {
  const theme = useTheme();
  const { locale } = useParams();

  return (
    <div className="flex items-center gap-3">
      <Link href={`/${locale}`}>
        <Image
          src={theme?.site?.logo || "/images/zeezfaveicon.png"}
          alt={theme?.site?.name || "Logo"}
          width={46}
          height={46}
        />
      </Link>
      <SearchBox />
    </div>
  );
}
