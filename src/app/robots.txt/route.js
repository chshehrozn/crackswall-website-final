import { getThemeData } from "@/utils/apis";

export async function GET() {
    const theme = await getThemeData();
    const robotsTxt = theme?.seo?.robotsTxt || "User-agent: *\nAllow: /";

    return new Response(robotsTxt, {
        headers: {
            "Content-Type": "text/plain",
        },
    });
}
