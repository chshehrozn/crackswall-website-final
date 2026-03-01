import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SetTitle from "@/components/SetTitle";
import CategoryFilter from "@/components/CategoryFilter";
import { getBlogsBySubCategory } from "@/utils/apis";
import { headers } from "next/headers";



export default async function SubCategoryPage({ categoryName, types, locale = 'en' }) {
  const subCategoriesData = await getBlogsBySubCategory(types, locale);
  const currentUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${categoryName}/${types}/`;
  // console.log("What is subCategoriesData...", subCategoriesData);
  const softwareList = subCategoriesData?.data?.data || [];
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
  if (!subCategoriesData?.status) {
    // Trigger 404 if the slug is invalid
    notFound();
  }
  if (subCategoriesData?.status) {
    return (
      <>
        <SetTitle title={categoryName} />
        <div className="margins">
          <div className="flex gap-10 py-5 md:flex-row flex-col">
            <div className="flex flex-col md:w-[350px] w-full gap-6 overflow-hidden">
              <CategoryFilter
                categorySlug={categoryName}
                subCategorySlug={types}
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
                {subCategoriesData?.data?.data?.length ? (
                  <>
                    {subCategoriesData?.data?.data?.map((meta, idx) => (
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
      </>
    );
  } else {
    return <p>Failed to fetch the data from database.</p>;
  }
}
