import { NextResponse } from "next/server";
import { getCategoriesData, getThemeData } from "@/utils/apis";

// Generate dynamic sitemaps
export async function generateSitemaps(baseUrl) {
  // Fetch categories and subcategories
  const categoriesData = await getCategoriesData();

  // Flatten categories and subcategories into a single array
  const flattenedCategories = categoriesData.flatMap((category) => [
    { ...category, subcategories: undefined },
    ...category.subcategories,
  ]);

  // Generate sitemaps using category `id` instead of index
  const sitemaps = flattenedCategories.map((category) => ({
    id: category.id,
    url: `${baseUrl}/post-sitemap${category.id}.xml`,
    lastmod: category.updated_at, // Use updated_at from category
  }));

  return sitemaps;
}

// Cache test
export async function GET(request) {
  try {
    const theme = await getThemeData();
    if (theme?.seo?.sitemapEnabled === false) {
      return new NextResponse(null, { status: 404 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || new URL(request.url).origin;

    // Fetch active languages to generate multilingual sitemaps
    let activeLocales = ['en'];
    try {
      const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3002';
      const langRes = await fetch(`${cmsUrl}/api/public/languages`, { next: { revalidate: 3600 } });
      if (langRes.ok) {
        const langData = await langRes.json();
        if (langData.status && langData.data) {
          activeLocales = langData.data.map(l => l.locale);
        }
      }
    } catch (e) {
      console.error("Sitemap: Failed to fetch languages", e);
    }

    // Combine static and dynamic sitemaps
    const sitemaps = [
      ...activeLocales.map(locale => ({
        url: `${baseUrl}/${locale}/sitemap.xml`,
        lastmod: new Date().toISOString(),
      })),
      {
        url: `${baseUrl}/category-sitemap.xml`,
        lastmod: new Date().toISOString(),
      },
      {
        url: `${baseUrl}/page-sitemap.xml`,
        lastmod: new Date().toISOString(),
      },
    ];

    const sitemapIndexXML = await buildSitemapIndex(sitemaps);

    return new NextResponse(sitemapIndexXML, {
      headers: {
        "Content-Type": "application/xml",
        "Content-Length": Buffer.byteLength(sitemapIndexXML).toString(),
      },
    });
  } catch (error) {
    console.error("Error generating sitemap index:", error);
    return NextResponse.error();
  }
}

// Build XML Sitemap Index
async function buildSitemapIndex(sitemaps) {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>';
  xml += '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  for (const { url, lastmod } of sitemaps) {
    xml += "<sitemap>";
    xml += `<loc>${url}</loc>`;
    xml += `<lastmod>${lastmod}</lastmod>`;
    xml += "</sitemap>";
  }

  xml += "</sitemapindex>";
  return xml;
}
