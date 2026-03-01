// app/[categoryName]/page.js

import { headers } from "next/headers";
// import NotFound from "@/app/not-found";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SetTitle from "@/components/SetTitle";
import CategoryFilter from "@/components/CategoryFilter";
import {
  getBlogsByCategory,
  getCategoriesList,
  postComment,
  getPageBySlug,
} from "@/utils/apis";

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const { categoryName } = resolvedParams;

  // Construct the current URL
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = host.includes("localhost") ? "http" : "https";
  const currentUrl = `${protocol}://${host}/${categoryName}`;

  // Fetch category data for dynamic metadata
  const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/categoryblogs/${categoryName}`;
  let categoryData;

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const json = await response.json();
      categoryData = json || {};
    }
  } catch (error) {
    console.error("Error fetching metadata data:", error);
  }

  // Default fallback metadata
  const defaultOGImage = `${process.env.NEXT_PUBLIC_WEB_URL}/default-og-image.jpg`;
  const defaultOGTitle = `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ${categoryName}`;
  const defaultDescription =
    "Free download Windows programs, plugins, codecs, drivers, tools, utilities, gaming tools, mobile phone tools, and operating systems.";

  // If category not found, try static page
  let pageData;
  if (!categoryData?.category) {
    try {
      const pageRes = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/pages/${categoryName}`);
      if (pageRes.ok) {
        const pageJson = await pageRes.json();
        if (pageJson.status) {
          pageData = pageJson.data;
        }
      }
    } catch { }
  }

  if (pageData) {
    return {
      title: `${pageData.title} - ${process.env.NEXT_PUBLIC_PROJECT_NAME}`,
      description: `Read more about ${pageData.title} on ${process.env.NEXT_PUBLIC_PROJECT_NAME}.`,
      alternates: {
        canonical: currentUrl,
      },
    };
  }

  return {
    title:
      categoryData?.category?.title ||
      `${process.env.NEXT_PUBLIC_PROJECT_NAME} - ${categoryName}`,
    description: categoryData?.category?.description || defaultDescription,
    openGraph: {
      title: categoryData?.category?.title || defaultOGTitle,
      url: currentUrl,
      images: [
        {
          url: categoryData?.category?.software_image || defaultOGImage,
        },
      ],
    },
    alternates: {
      canonical: currentUrl,
    },
  };
}

export default async function CategoryPage({ params }) {
  const currentUrl = `${process.env.NEXT_PUBLIC_WEB_URL}`;
  const resolvedParams = await params;
  const { locale, categoryName } = resolvedParams;
  const pathname = `/${categoryName}`;

  const softwareList = await getBlogsByCategory(categoryName, locale);
  await getCategoriesList({
    url: currentUrl,
  });

  const pageResp = await getPageBySlug(categoryName, locale);

  if (!softwareList?.status && !pageResp?.status) {
    notFound();
  }

  if (pageResp?.status) {
    const page = pageResp.data;
    return (
      <>
        <SetTitle title={page.title} />
        <div className="margins min-h-[70vh] py-10">
          <div className="bg-white rounded-lg border border-[#ebebeb] p-8 shadow-sm">
            <h1 className="text-3xl font-bold text-[#2b373a] mb-6">{page.title}</h1>
            <div className="prose prose-lg max-w-none text-[#555]" dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        </div>
      </>
    );
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
    ...softwareList?.data?.data?.map((software) => ({
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: software.software_name,
      operatingSystem: software.operating_system,
      applicationCategory: software.application_category,
      offers: {
        "@type": "Offer",
        price: software.price,
        priceCurrency: "USD",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        reviewCount: software.review_count,
        ratingValue: software.rating_value,
      },
    })),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Thing",
            "@id": `${process.env.NEXT_PUBLIC_WEB_URL}${categoryName}`,
            name: `${categoryName}`,
          },
        },
      ],
    },
  ];
  const response = await postComment({
    url: currentUrl,
  });
  if (!response?.status) {
    notFound();
  }

  if (softwareList?.status) {
    return (
      <>
        <SetTitle title={categoryName} />
        <div className="margins">
          <div className="flex gap-10 py-5 md:flex-row flex-col">
            <div className="flex flex-col md:w-[350px] w-full gap-6 overflow-hidden">
              <CategoryFilter
                categorySlug={categoryName}
                subCategorySlug={pathname}
                locale={locale}
              />
            </div>
            <div className="flex flex-col flex-1 gap-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center mb-2 bg-white overflow-hidden border border-[#ebebeb] min-h-[66px] w-full relative">
                  <div className="h-full w-[6px] bg-[#00856f] absolute top-0 left-0 bottom-0"></div>
                  <div className="flex items-center justify-between w-full px-7">
                    <h4 className="text-[#2b373a] text-xl font-bold capitalize">
                      {categoryName || "-"}
                    </h4>
                  </div>
                </div>
                {softwareList?.data?.data?.length ? (
                  <>
                    {softwareList?.data?.data?.map((meta, idx) => (
                      <ProductCard key={idx} data={meta} slug={categoryName} locale={locale} />
                    ))}
                  </>
                ) : (
                  <div className="">Data No Found!</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Inject JSON-LD for SEO */}
        {softwareList?.data?.data?.length ? (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        ) : null}
      </>
    );
  } else {
    return <p>Failed to fetch the data from database.</p>;
  }
}
