'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
    const [languages, setLanguages] = useState([]);
    const [activeLang, setActiveLang] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // In Next 13+ App router, usePathname gives us the full path
    const pathname = usePathname(); // e.g. /en/windows
    const router = useRouter();

    useEffect(() => {
        // Fetch active languages (Force CMS port 3002 in dev to avoid collision with Laravel backend)
        const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3002' : (process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3002');
        fetch(`${baseUrl}/api/public/languages`)
            .then(res => res.json())
            .then(data => {
                if (data.status) {
                    setLanguages(data.data);

                    // Determine current language from pathname
                    // Pathname is usually like /en/something
                    const currentLocale = pathname.split('/')[1];
                    const found = data.data.find(l => l.locale === currentLocale);
                    if (found) {
                        setActiveLang(found);
                    } else if (data.data.length > 0) {
                        setActiveLang(data.data[0]); // default
                    }
                }
            })
            .catch(err => console.error('Failed to load languages', err));
    }, [pathname]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSwitch = (lang) => {
        setIsOpen(false);
        setActiveLang(lang);

        // Replace the current locale in the URL with the new one
        const segments = pathname.split('/');
        // Default assumes /en/something. So segments[1] is 'en'.

        let newPathname = pathname;
        if (segments.length > 1) {
            // Check if segments[1] is a known locale
            const currentLocale = segments[1];
            const isKnownLocale = languages.some(l => l.locale === currentLocale);

            if (isKnownLocale) {
                segments[1] = lang.locale;
                newPathname = segments.join('/');
            } else {
                newPathname = `/${lang.locale}${pathname === '/' ? '' : pathname}`;
            }
        } else {
            newPathname = `/${lang.locale}`;
        }

        router.push(newPathname);
    };

    if (!activeLang || languages.length <= 1) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 hover:bg-[#f5f5f5] rounded-md transition duration-200"
                title={`Current language: ${activeLang.name}`}
            >
                <div
                    className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center border border-gray-200 shadow-sm"
                    dangerouslySetInnerHTML={{ __html: activeLang.flag_icon }}
                />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-xl z-50 overflow-hidden py-2">
                    {languages.map(lang => (
                        <button
                            key={lang.locale}
                            onClick={() => handleSwitch(lang)}
                            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-[#f0f9ff] hover:text-[#00856f] transition tracking-tight text-sm ${activeLang.locale === lang.locale ? 'bg-[#f0f9ff] text-[#00856f] font-medium' : 'text-[#555]'}`}
                        >
                            <div
                                className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center border border-gray-200"
                                dangerouslySetInnerHTML={{ __html: lang.flag_icon }}
                            />
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
