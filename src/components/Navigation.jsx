"use client";
import NavLeft from "./NavLeft";
import NavLink from "./NavLink";
import NavTitle from "./NavTitle";
import { MenuIcon } from "@/icons";
import { getCategoriesData } from "@/utils/apis";
import { useTheme } from "@/context/ThemeContext";
import { useState, useEffect } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useParams } from "next/navigation";

// ... (rest of the code)

export default function Navigation() {
  const theme = useTheme();
  const { locale } = useParams();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategoriesData(locale).then(setCategories);
  }, [locale]);

  return (
    <div className="flex flex-col top-0 z-40 min-h-16 shrink-0 items-center transition-colors duration-300 shadow-sm" style={{ backgroundColor: theme?.header?.backgroundColor || '#ffffff' }}>
      <div className="flex w-full py-4">
        <div className="margins w-full">
          <div className="flex w-full">
            <NavLeft />
            <div className="flex flex-1 items-center justify-end">
              <div className="hidden md:flex items-center gap-5">
                {categories?.map((item, index) => (
                  <div key={index}>
                    <NavLink label={item.title} href={`/${locale}/${item.slug}`} />
                  </div>
                ))}

                <div className="border-l border-gray-200 h-6 ml-2 mr-2"></div>
                <LanguageSwitcher />
              </div>
              <div
                className="flex md:hidden items-center justify-center cursor-pointer"
              // onClick={() => setOpenSidebar(true)}
              >
                <MenuIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
      {theme?.header?.showNavTitle !== false && <NavTitle />}
    </div>
  );
}
