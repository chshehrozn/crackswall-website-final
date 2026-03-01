import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SetTitle from "@/components/SetTitle";
import CategoryFilter from "@/components/CategoryFilter";
import { getSearchBlogs } from "@/utils/apis";

export async function generateMetadata({ searchParams }) {
  const query = searchParams?.q || "";
  return {
    title: `You search for ${query} | ${process.env.NEXT_PUBLIC_PROJECT_NAME}`,
    description: "Free download Windows programs, plugins, codecs, drivers, tools, utilities, gaming tools, mobile phone tools, and operating systems.",
  };
}

export default async function SearchPage({ params, searchParams }) {
  const resolvedParams = await params;
  const { locale } = resolvedParams;
  const query = searchParams?.q || "";
  const currentUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/search?q=${query}`;
  const data = await getSearchBlogs(query, locale);

  if (data?.status) {
    return (
      <>
        <SetTitle title={query} />
        <div className="margins">
          <div className="flex gap-10 py-5 md:flex-row flex-col">
            <div className="flex flex-col md:w-[350px] w-full gap-6 overflow-hidden">
              <CategoryFilter categorySlug={""} subCategorySlug={""} locale={locale} />
            </div>
            <div className="flex flex-col flex-1 gap-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center mb-2 bg-white overflow-hidden border border-[#ebebeb] min-h-[66px] w-full relative">
                  <div className="h-full w-[6px] bg-[#00856f] absolute top-0 left-0 bottom-0"></div>
                  <div className="flex items-center justify-between w-full px-7">
                    <h4 className="text-[#2b373a] text-xl font-bold capitalize">
                      {`Products found (${data?.data?.length})` || "-"}
                    </h4>
                  </div>
                </div>
                {data?.data?.length ? (
                  <>
                    {data?.data?.map((meta, idx) => (
                      <ProductCard key={idx} data={meta} slug={""} locale={locale} />
                    ))}
                  </>
                ) : (
                  <div className="min-h-[400px] flex items-center justify-center">
                    <p className="text-xl font-semibold">No results found for "{query}"</p>
                  </div>
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
