import { NextResponse } from "next/server";
import { getAllBlogsData, getThemeData } from "@/utils/apis";

export async function GET(request, { params }) {
  try {
    const allBlogsList = await getAllBlogsData();
    if (!allBlogsList) {
      throw new Error("Failed to fetch blogs from CMS API");
    }
    const allBlogs = allBlogsList.flatMap((item) => item?.blogs?.data || []);

    const theme = await getThemeData();
    if (theme?.seo?.sitemapEnabled === false) {
      return new NextResponse(null, { status: 404 });
    }

    const { sitemapName } = params;
    const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || new URL(request.url).origin;

    // Generate XML sitemap dynamically
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
            xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
      ${allBlogs
        .map(
          (blog) => {
            const dateStr = blog.created_date ? `${blog.created_date}T${blog.created_time || '00:00:00'}` : null;
            let lastmodDate = dateStr ? new Date(dateStr) : new Date();
            if (isNaN(lastmodDate.getTime())) lastmodDate = new Date();
            const lastmod = lastmodDate.toISOString();

            return `
        <url>
          <loc>${baseUrl}/${blog?.category?.slug || 'post'}/${blog.slugs || blog.slug}</loc>
          <lastmod>${lastmod}</lastmod>
          ${blog.images?.[0]
                ? `
      <image:image>
        <image:loc>${process.env.NEXT_PUBLIC_WEB_URL}/${blog.images[0].image_path.replace(/^public\//, '')}</image:loc>
      </image:image>`
                : ""
              }
        </url>`;
          }
        )
        .join("")}
    </urlset>`;

    return new NextResponse(xml, {
      headers: { "Content-Type": "application/xml" },
    });
  } catch (error) {
    console.error("Error generating sitemap:", error.message);
    return new NextResponse(`Error generating sitemap: ${error.message}`, { status: 500 });
  }
}
