"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ButtonLink({ label, href }) {
  const pathname = usePathname();
  return (
    <Link className={`buttonPrimary !py-3 text-center !w-max`} href={href}>
      {label}
    </Link>
  );
}
