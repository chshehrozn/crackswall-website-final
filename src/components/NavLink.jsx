"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLoadingStore } from "@/app/store/loadingStore";

import { useTheme } from "@/context/ThemeContext";

export default function NavLink({ label, href }) {
  const theme = useTheme();
  const pathname = usePathname();
  const setIsLoading = useLoadingStore((state) => state.setIsLoading);

  const isActive = pathname === href;

  return (
    <Link
      className={`nav-link font-medium hover:cursor-pointer transition-colors duration-300`}
      style={{
        color: isActive ? (theme?.menu?.activeColor || '#00856f') : 'inherit',
        fontSize: theme?.menu?.fontSize || '18px'
      }}
      href={href}
      onClick={() => {
        if (pathname !== href) {
          setIsLoading(true);
        }
      }}
    >
      {label}
    </Link>
  );
}
