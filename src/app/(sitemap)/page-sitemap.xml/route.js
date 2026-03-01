import { NextResponse } from "next/server";
import { getThemeData } from "@/utils/apis";

export async function GET(request) {
  try {
    const theme = await getThemeData();
    if (theme?.seo?.sitemapEnabled === false) {
      return new NextResponse(null, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || new URL(request.url).origin;
    const lastmod = new Date().toISOString();

    const pages = [
      "en",
      "windows",
      "macos",
      "pc-games",
      "terms",
      "privacy",
      "contact",
      "about",
      "faqs",
      "dmca",
      "ad-blocker",
      "how-to-download",
      "zip-password",
      "cookies",
    ];

    // Generate XML sitemap dynamically
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map(
          (page) => `
        <url>
          <loc>${baseUrl}/${page}/</loc>
          <lastmod>${lastmod}</lastmod>
        </url>`
        )
        .join("")}
    </urlset>`;

    return new NextResponse(xml, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
