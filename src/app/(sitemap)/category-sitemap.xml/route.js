import { NextResponse } from "next/server";
import { getCategoriesData, getThemeData } from "@/utils/apis";

// Fetch categories and subcategories
const categoriesData = await getCategoriesData();

export async function GET(request) {
  try {
    const theme = await getThemeData();
    if (theme?.seo?.sitemapEnabled === false) {
      return new NextResponse(null, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || new URL(request.url).origin;

    // Assuming `categoriesData` is an array of categories
    const sitemaps = categoriesData.map((category) => {
      let sitemapEntries = [];

      let catDate = category.updated_at ? new Date(category.updated_at) : new Date();
      if (isNaN(catDate.getTime())) catDate = new Date();
      const catLastMod = catDate.toISOString();

      // First entry: Base category URL
      sitemapEntries.push(
        `<url>
          <loc>${baseUrl}/${category.slug}/</loc>
          <lastmod>${catLastMod}</lastmod>
        </url>`
      );

      if (category.subcategories && category.subcategories.length > 0) {
        category.subcategories.forEach((sub) => {
          let subDate = sub.updated_at ? new Date(sub.updated_at) : new Date();
          if (isNaN(subDate.getTime())) subDate = new Date();
          const subLastMod = subDate.toISOString();

          sitemapEntries.push(
            `<url>
              <loc>${baseUrl}/${category.slug}/${sub.slug}/</loc>
              <lastmod>${subLastMod}</lastmod>
            </url>`
          );
        });
      }

      return sitemapEntries.join("");
    });

    // Generate XML sitemap dynamically
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemaps.join("")}
    </urlset>`;

    return new NextResponse(xml, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
