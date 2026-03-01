import { NextResponse } from "next/server";
import { getAllBlogsData, getThemeData } from "@/utils/apis";

export async function GET(request, { params }) {
    try {
        const resolvedParams = await params;
        const { locale } = resolvedParams;

        // Fetch translated blogs for this locale
        const allBlogsList = await getAllBlogsData(locale);
        if (!allBlogsList) {
            throw new Error("Failed to fetch blogs from CMS API");
        }
        const allBlogs = allBlogsList.flatMap((item) => item?.blogs?.data || []);

        const theme = await getThemeData();
        if (theme?.seo?.sitemapEnabled === false) {
            return new NextResponse(null, { status: 404 });
        }

        const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || new URL(request.url).origin;

        // Generate XML sitemap dynamically for the current locale
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      <url>
        <loc>${baseUrl}/${locale}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      ${allBlogs
                .map(
                    (blog) => {
                        const dateStr = blog.created_date ? `${blog.created_date}T${blog.created_time || '00:00:00'}` : null;
                        let lastmodDate = dateStr ? new Date(dateStr) : new Date();
                        if (isNaN(lastmodDate.getTime())) lastmodDate = new Date();
                        const lastmod = lastmodDate.toISOString();

                        return `
        <url>
          <loc>${baseUrl}/${locale}/${blog?.category?.slug || 'post'}/${blog.slugs || blog.slug}</loc>
          <lastmod>${lastmod}</lastmod>
          <priority>0.8</priority>
          ${blog.images?.[0]
                                ? `
      <image:image>
        <image:loc>${process.env.NEXT_PUBLIC_WEB_URL}/${blog.images[0].image_path.replace(/^public\//, '')}</image:loc>
        <image:title>${blog.software_name || blog.title}</image:title>
      </image:image>`
                                : ""
                            }
        </url>`;
                    }
                )
                .join("")}
    </urlset>`;

        return new NextResponse(xml, {
            headers: {
                "Content-Type": "application/xml",
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=59"
            },
        });
    } catch (error) {
        console.error(`Error generating sitemap for ${params.locale}:`, error.message);
        return new NextResponse(`Error generating sitemap: ${error.message}`, { status: 500 });
    }
}
