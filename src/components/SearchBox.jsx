"use client";
import React, { useState, useEffect, useRef } from "react";
import { SearchIcon } from "@/icons";
import { useRouter, useParams } from "next/navigation";
import { getSearchBlogs } from "@/utils/apis";
import Link from "next/link";
import Image from "next/image";
import { useTranslation } from "@/context/TranslationContext";

const SearchBox = () => {
  const router = useRouter();
  const { locale } = useParams();
  const dictionary = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when typing outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchTerm.trim().length >= 2) {
        setIsLoading(true);
        try {
          const res = await getSearchBlogs(searchTerm, locale);
          if (res?.data) {
            setResults(res.data.slice(0, 5)); // Limit to Top 5 Quick Results
          }
        } catch (err) {
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleKeyPress = (e) => {
    if (searchTerm.trim().length < 3) {
      alert(dictionary?.search_min_chars || "Please type at least 3 characters.");
      return;
    }
    setIsFocused(false);
    router.push(`/${locale}/search/?q=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="search-box relative flex items-center h-9 rounded-lg overflow-hidden bg-[#F5F5F5] border border-[#ebebeb] focus-within:border-[#00856f] anim z-50">
        <div className="search-icon flex items-center justify-center bg-[#00856f] border-2 border-solid border-[#00856f] h-full w-10">
          <SearchIcon />
        </div>
        <input
          type="text"
          className="bg-transparent sm:w-96 w-full py-1 px-3 font-medium focus:outline-none"
          placeholder={dictionary?.search_placeholder || "Search software, games..."}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleKeyPress(e);
            }
          }}
        />
        {isLoading && (
          <div className="absolute right-3 animate-spin w-4 h-4 border-2 border-[#00856f] border-t-transparent rounded-full"></div>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isFocused && (searchTerm.trim().length >= 2) && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-4 duration-200">
          {results.length > 0 ? (
            <div className="flex flex-col">
              <div className="px-4 py-2 bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                {dictionary?.top_matches || "Top Matches"}
              </div>
              {results.map((item) => {
                const imgPath = item.image?.startsWith('http') ? item.image : `${process.env.NEXT_PUBLIC_WEB_URL}/${item.image?.replace(/^public\//, '')}`;
                return (
                  <Link
                    key={item.id}
                    href={`/${locale}/${item.category?.slug || 'software'}/${item.slugs}`}
                    onClick={() => {
                      setIsFocused(false);
                      setSearchTerm("");
                    }}
                    className="flex items-center gap-4 p-3 hover:bg-[#00856f]/5 border-b border-gray-50 transition"
                  >
                    {item.image && (
                      <div className="w-10 h-10 rounded shadow-sm border border-gray-200 overflow-hidden shrink-0 bg-gray-100">
                        <img src={imgPath} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex flex-col flex-1 truncate">
                      <span className="text-sm font-bold text-gray-900 truncate">{item.software_name || item.title}</span>
                      <span className="text-xs text-gray-500 truncate">{item.software_version || (dictionary?.latest || 'Latest')} • {item.application_category || 'Software'}</span>
                    </div>
                  </Link>
                );
              })}
              <button
                onClick={() => handleKeyPress()}
                className="w-full p-3 bg-gray-50 text-sm font-bold text-[#00856f] hover:bg-gray-100 transition text-center"
              >
                {dictionary?.view_all_results_for || "View all results for"} "{searchTerm}" &rarr;
              </button>
            </div>
          ) : (
            !isLoading && (
              <div className="p-4 text-center text-sm text-gray-500">
                {(dictionary?.no_software_found || "No software found matching")} "{searchTerm}"
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
