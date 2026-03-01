import { NextResponse } from "next/server";

export default async function middleware(req) {
  // const baseUrl = req.nextUrl.origin;
  const { pathname, origin: baseUrl } = req.nextUrl;
  console.log("Middleware checking URL:", baseUrl, pathname);

  const installed = req.cookies.get('cms_api_url')?.value;
  const backendUrl = installed ? installed.replace(/\/$/, '').replace(/\/api$/, '') : null;

  // Allow setup and static paths
  if (pathname.includes('/setup') || pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.startsWith('/images')) {
    return NextResponse.next();
  }

  // If not installed, redirect to setup (maintaining locale if present)
  if (!backendUrl) {
    const locale = pathname.split('/')[1] || 'en';
    // Allow 'en' as default if first segment is not a locale
    const validLocales = ['en', 'ar', 'he', 'fa', 'ur']; // Basic check
    const currentLocale = validLocales.includes(locale) ? locale : 'en';
    return NextResponse.redirect(new URL(`/${currentLocale}/setup`, req.url));
  }

  try {
    // 1. Existing License check
    await fetch("https://presale-backend-nine.vercel.app/api/searchValue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ slug: baseUrl }),
    });

    const verifyResponse = await fetch(
      "https://presale-backend-nine.vercel.app/api/search",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug: baseUrl }),
      }
    );

    if (!verifyResponse.ok) {
      console.log("Verify error: verifResponse.ok is false");
      return NextResponse.rewrite(new URL("/not-found", req.url));
    }

    const verifyResult = await verifyResponse.json();
    console.log("Verify result:", verifyResult);

    if (!verifyResult.status) {
      return NextResponse.rewrite(new URL("/not-found", req.url));
    }

    // 2. i18n Localization Check
    let activeLocales = ['en'];
    try {
      const cmsUrl = backendUrl;
      const res = await fetch(`${cmsUrl}/api/public/languages`, { next: { revalidate: 60 } });
      if (res.ok) {
        const data = await res.json();
        if (data.status && data.data) {
          activeLocales = data.data.map(l => l.locale);
        }
      }
    } catch (e) { }

    const defaultLocale = activeLocales.includes('en') ? 'en' : (activeLocales[0] || 'en');

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = activeLocales.every(
      (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    if (pathnameIsMissingLocale) {
      // e.g. /windows -> /en/windows
      return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, req.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware fetch error:", error);
    // If the ping fails due to timeout/network, allow the site to load
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|images|favicon.ico|sitemap.xml|.*/sitemap.xml|post-sitemap.*.xml).*)",
  ],
};
