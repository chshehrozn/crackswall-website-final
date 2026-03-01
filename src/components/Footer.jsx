"use client";
import { useTheme } from "@/context/ThemeContext";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTranslation } from "@/context/TranslationContext";

export default function Footer() {
  const { locale } = useParams();
  const theme = useTheme();
  const dictionary = useTranslation();
  const currentYear = new Date().getFullYear();
  const copyright = (dictionary?.copyright_text || "Copyright © {year} - All right reserved by ZEEZSOFT").replace("{year}", currentYear);

  return (
    <footer className="w-full pt-10 pb-5 transition-colors duration-300 mt-20" style={{ backgroundColor: theme?.footer?.backgroundColor || '#21282a' }}>
      <div className="margins flex flex-col md:flex-row gap-8 justify-between text-sm mb-10" style={{ color: theme?.footer?.textColor || '#bbb' }}>
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold text-lg mb-2">{dictionary?.help_support || "Help & Support"}</h4>
          <Link href={`/${locale}/about`} className="hover:text-[#00856f] transition-colors">{dictionary?.about || "About"}</Link>
          <Link href={`/${locale}/zip-password`} className="hover:text-[#00856f] transition-colors">{dictionary?.zip_password || "Zip Password"}</Link>
          <Link href={`/${locale}/how-to-download`} className="hover:text-[#00856f] transition-colors">{dictionary?.how_to_download || "How to Download"}</Link>
          <Link href={`/${locale}/ad-blocker`} className="hover:text-[#00856f] transition-colors">{dictionary?.ad_blocker || "Ad Blocker"}</Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold text-lg mb-2">{dictionary?.community || "Community"}</h4>
          <Link href={`/${locale}/software-request`} className="hover:text-[#00856f] transition-colors">{dictionary?.software_request || "Software request"}</Link>
          <Link href={`/${locale}/software-submission`} className="hover:text-[#00856f] transition-colors">{dictionary?.software_submission || "Software submission"}</Link>
          <Link href={`/${locale}/contact`} className="hover:text-[#00856f] transition-colors">{dictionary?.contact_us || "Contact Us"}</Link>
          <Link href={`/${locale}/faqs`} className="hover:text-[#00856f] transition-colors">{dictionary?.faqs || "FAQs"}</Link>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="text-white font-bold text-lg mb-2">{dictionary?.platform || "Platform"}</h4>
          <Link href={`/${locale}/windows-11`} className="hover:text-[#00856f] transition-colors">{dictionary?.windows_11 || "Windows 11"}</Link>
          <Link href={`/${locale}/windows-10`} className="hover:text-[#00856f] transition-colors">{dictionary?.windows_10 || "Windows 10"}</Link>
          <Link href={`/${locale}/windows-7`} className="hover:text-[#00856f] transition-colors">{dictionary?.windows_7_8 || "Windows 7 & 8"}</Link>
          <Link href={`/${locale}/mac`} className="hover:text-[#00856f] transition-colors">{dictionary?.mac || "Mac"}</Link>
          <Link href={`/${locale}/android`} className="hover:text-[#00856f] transition-colors">{dictionary?.android_apk || "Android APK"}</Link>
        </div>
      </div>

      <div className="flex w-full margins justify-center border-t border-[#333] pt-5">
        <p className="text-sm font-medium capitalize transition-colors duration-300" style={{ color: theme?.footer?.textColor || '#bbb' }} suppressHydrationWarning>
          {copyright}
        </p>
      </div>
    </footer>
  );
}
