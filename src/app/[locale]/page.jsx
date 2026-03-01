import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import ProductCardGame from "@/components/ProductCardGame";
import NavLink from "@/components/NavLink";
import SetTitle from "@/components/SetTitle";
import { getThemeData, getAllBlogsData, getBlogsByCategory, getCategoriesList, postComment, getAllCategoryBlogs } from "@/utils/apis";
import * as fs from "fs";

export async function generateMetadata() {
  const theme = await getThemeData();
  const siteName = theme?.site?.name || "CracksWall";
  return {
    title: `${siteName} - Full Version Software`,
    description: "Free Download Windows & MacOS software, Android Apps & Games, E-Learning Videos & E-Books, PC Games, Scripts and much more.",
    verification: {
      google: "9Kha2iKnwOoPb2FeEYHIHIAGFNGBXY-zokhlaqApGhg",
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${siteName} - Full Version Software`,
      url: process.env.NEXT_PUBLIC_WEB_URL,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_WEB_URL}`,
    },
  };
}

export default async function Home({ params }) {
  const { locale } = await params;
  console.log("EXECUTING HOME PAGE [locale]/page.jsx");
  const currentUrl = `${process.env.NEXT_PUBLIC_WEB_URL}`;
  const [allBlogs, gameCategoryBlogs, blogs, _catsRes, response] = await Promise.all([
    getAllBlogsData(locale),
    getBlogsByCategory("pc-games", locale),
    getAllCategoryBlogs(locale),
    getCategoriesList({ url: currentUrl }),
    postComment({ url: currentUrl })
  ]);

  let filterBlogs = allBlogs || [];
  const softwareList = blogs?.data || [];

  if (allBlogs?.length) {
    const filterData = allBlogs?.filter((item) => item?.slug !== "pc-games");
    filterBlogs = filterData;
  }
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      url: `${process.env.NEXT_PUBLIC_WEB_URL}`,
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${process.env.NEXT_PUBLIC_WEB_URL}/search?query={search_term_string}`,
        },
        "query-input": {
          "@type": "PropertyValueSpecification",
          valueRequired: "http://schema.org/True",
          valueName: "search_term_string",
        },
      },
    },
    ...softwareList.map((software) => ({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: software.software_name,
      operatingSystem: software.operating_system,
      applicationCategory: software.application_category,
      offers: {
        "@type": "Offer",
        price: software.price.split(" ")[0],
        priceCurrency: software.price.split(" ")[1],
      },
      aggregateRating: {
        "@type": "AggregateRating",
        reviewCount: software.review_count,
        ratingValue: software.rating_value,
      },
    })),
  ];
  if (allBlogs.length < 0 || !gameCategoryBlogs?.status) {
    fs.appendFileSync("/Users/macbook/Documents/backend-v2/frontend/test-logs/log.txt", JSON.stringify({ reason: "gameCategoryBlogs", allBlogsLength: allBlogs.length, gameStatus: gameCategoryBlogs?.status }) + "\n");
    console.log("Failed allBlogs or gameCategoryBlogs", { allBlogsLength: allBlogs.length, gameStatus: gameCategoryBlogs?.status });
    notFound();
  }

  if (!response?.status) {
    fs.appendFileSync("/Users/macbook/Documents/backend-v2/frontend/test-logs/log.txt", JSON.stringify({ reason: "response", responseStatus: response?.status }) + "\n");
    console.log("Failed response (license check)", { responseStatus: response?.status });
    notFound();
  }

  if (allBlogs.length && gameCategoryBlogs?.status) {
    return (
      <>
        <SetTitle title={""} />
        <div className="margins min-h-screen">
          <div className="flex md:flex-row flex-col gap-10 py-5">
            <div className="flex flex-col flex-1 gap-6">
              {filterBlogs?.length ? (
                filterBlogs.map((item, index) => (
                  <div key={index} className="flex flex-col gap-6">
                    <div className="flex items-center mb-2 bg-white overflow-hidden border border-[#ebebeb] min-h-[66px] w-full relative">
                      <div className="h-full w-[6px] bg-[#00856f] absolute top-0 left-0 bottom-0"></div>
                      <div className="flex items-center justify-between w-full px-7">
                        <h4 className="text-[#2b373a] text-xl font-bold">
                          {item.title || "-"}
                        </h4>
                        <NavLink label={"View All"} href={`/${locale}/${item.slug}`} />
                      </div>
                    </div>
                    {item.blogs?.data?.length ? (
                      <>
                        {item.blogs?.data
                          ?.sort(
                            (a, b) =>
                              new Date(b.created_at) - new Date(a.created_at)
                          )
                          ?.slice(0, 10)
                          ?.map((meta, idx) => (
                            <div key={idx}>
                              <ProductCard key={idx} data={meta} slug={""} locale={locale} />
                            </div>
                          ))}
                      </>
                    ) : (
                      <div className="">Data No Found!</div>
                    )}
                  </div>
                ))
              ) : (
                <div>No blogs found!</div>
              )}
            </div>
            <div className="flex flex-col md:w-[350px] w-full overflow-hidden">
              <div className="flex flex-col gap-4 sticky bg-white  border border-[#ebebeb] p-6 rounded">
                {gameCategoryBlogs?.status && (
                  <ProductCardGame gameCategoryBlogs={gameCategoryBlogs} locale={locale} />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Inject JSON-LD for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </>
    );
  } else {
    return <p>Failed to fetch the data from database.</p>;
  }
}
