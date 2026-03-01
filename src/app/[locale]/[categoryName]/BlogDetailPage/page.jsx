// import Head from "next/head";
import moment from "moment";
import { notFound } from "next/navigation";
import { getBlogDetail } from "@/utils/apis";
import SetTitle from "@/components/SetTitle";
import ButtonLink from "@/components/ButtonLink";
import SwiperCard from "@/components/SwiperCard";
import StarRating from "@/components/StarRating";
import CommentFrom from "@/components/CommentForm";
import CommentsList from "@/components/CommentsList";
import RemandedBlogCard from "@/components/RemandedBlogCard";
import ReportLinkButton from "@/components/ReportLinkButton";
import { getBlogsBySubCategory } from "@/utils/apis";
import { getDictionary } from "@/dictionaries/getDictionary";
import { formatToUTCPlus5 } from "@/utils/common";
import { ShieldCheck, Lock, MonitorPlay, ListPlus, Download } from "lucide-react";


export default async function BlogDetailPage({ categoryName, types, locale = 'en' }) {
  const dictionary = await getDictionary(locale);
  const data = await getBlogDetail(types, locale);
  if (!data?.status) {
    notFound();
  }

  const currentUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${categoryName}/${types}/`;

  const subCategoryData = await getBlogsBySubCategory(
    data?.data?.subcategory?.slug,
    locale
  );

  let subCategoriesList = subCategoryData?.data?.data || [];

  if (subCategoryData?.data?.data?.length) {
    const filterData = subCategoryData?.data?.data?.filter(
      (item) => item.slugs !== types
    );
    subCategoriesList = filterData;
  }
  // console.log("what is subCategoryData", subCategoryData);
  // console.log("what is subCategoriesList", subCategoriesList);

  const screenshotsArray = data?.data?.images.map(
    (image) => image.image_path?.startsWith('http') ? image.image_path : `${process.env.NEXT_PUBLIC_WEB_URL}/${image.image_path?.replace(/^public\//, '')}`
  );

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: data?.data?.software_name,
      url: `${process.env.NEXT_PUBLIC_WEB_URL}/${data?.data?.category?.slug}/${data?.data?.slugs}`,
      version: data?.data?.software_version,
      description: data?.data?.software_version,
      image: data?.data?.soft_image,
      screenshot: screenshotsArray, // Mapping screenshots from the images array
      applicationCategory: data?.data?.application_category,
      operatingSystem: data?.data?.operating_system,
      datePublished: `${data?.data?.created_date}T${data?.data?.created_time}`,
      dateModified: data?.data?.date_modified
        ? formatToUTCPlus5(data?.data?.date_modified)
        : data?.data?.date_modified,
      publisher: {
        "@type": "Organization",
        name: data?.data?.publisher_name,
        url: `${process.env.NEXT_PUBLIC_WEB_URL}`,
      },
      offers: {
        "@type": "Offer",
        price: data?.data?.price.split(" ")[0],
        priceCurrency: data?.data?.price.split(" ")[1],
      },
      aggregateRating: {
        "@type": "AggregateRating",
        reviewCount: data?.data?.review_count,
        bestRating: 5,
        ratingValue: data?.data?.rating_value,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "Thing",
            "@id": `${process.env.NEXT_PUBLIC_WEB_URL}/${data?.data?.category?.slug}/${data?.data?.slugs}`,
            name: `${data?.data?.operating_system}`,
          },
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      datePublished: `${data?.data?.created_date}T${data?.data?.created_time}`,
      description: data?.data?.software_description,
      headline: data?.data?.title,
      // image: screenshotsArray,
      dateModified: data?.data?.date_modified
        ? formatToUTCPlus5(data?.data?.date_modified)
        : data?.data?.date_modified,
      isAccessibleForFree: "http://schema.org/True",
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `${process.env.NEXT_PUBLIC_WEB_URL}/${data?.data?.category?.slug}/${data?.data?.slugs}`,
      },
      author: {
        "@type": "Person",
        name: data?.data?.publisher_name,
        url: `${process.env.NEXT_PUBLIC_WEB_URL}`,
      },
      publisher: {
        "@type": "Organization",
        name: `${process.env.NEXT_PUBLIC_PROJECT_NAME}`,
        logo: {
          "@type": "ImageObject",
          url: "./images/zeezfaveicon.png",
        },
      },
    },
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
  ];

  let downloadMirrors = [];
  try {
    if (data?.data?.download_mirrors) {
      downloadMirrors = JSON.parse(data.data.download_mirrors);
    }
  } catch (e) {
    console.error("Invalid download mirrors JSON");
  }

  if (data?.status) {
    return (
      <>
        <SetTitle
          title={`${data?.data?.original_software_name || data?.data?.software_name} ${data?.data?.software_version}`}
        />
        <div className="margins min-h-[730px]">
          <div className="flex gap-6 md:flex-row flex-col mt-10">
            <div className="flex flex-col flex-1 gap-6 text-3xl text-black font-semibold">
              <div className="flex flex-col gap-3 bg-white rounded-lg border border-solid border-[#ebebeb] p-5">
                <h2 className="font-sans text-3xl text-[#2b373a] font-bold mb-4">
                  {`${data?.data?.software_name} ${data?.data?.software_version} ${dictionary.latest_download}`}
                </h2>
                <div className="text-sm text-[#666] font-normal">
                  {data?.data?.software_description}{" "}
                  <span className="text-[#00856f] font-semibold">{dictionary.latest_download}</span>
                </div>
                <div className="flex flex-col w-full">
                  <div className="flex items-center justify-center">
                    {data?.data?.images?.length ? (
                      <SwiperCard data={data} />
                    ) : null}
                  </div>

                  <div className="prose prose-lg mx-auto my-8">
                    <div
                      className="blog-content"
                      dangerouslySetInnerHTML={{
                        __html: data?.data?.detail,
                      }}
                    />
                  </div>

                  {/* Advanced Content Widgets */}
                  {(data?.data?.system_requirements || data?.data?.changelog) && (
                    <div className="flex flex-col gap-6 mt-8">
                      {data?.data?.system_requirements && (
                        <div className="bg-[#f8fbfa] border border-[#e5eeec] rounded-xl p-6 shadow-sm">
                          <h3 className="text-xl font-bold text-[#2b373a] mb-4 flex items-center gap-2">
                            <MonitorPlay size={22} className="text-emerald-500" /> {dictionary.operating_system}
                          </h3>
                          <div className="text-[#555] whitespace-pre-wrap text-sm leading-relaxed font-mono bg-white p-4 border border-gray-100 rounded-lg">
                            {data?.data?.system_requirements}
                          </div>
                        </div>
                      )}

                      {data?.data?.changelog && (
                        <div className="bg-[#fdfaf5] border border-[#f5ead6] rounded-xl p-6 shadow-sm">
                          <h3 className="text-xl font-bold text-[#2b373a] mb-4 flex items-center gap-2">
                            <ListPlus size={22} className="text-amber-500" /> {dictionary.latest_posts}
                          </h3>
                          <div className="text-[#555] whitespace-pre-wrap text-sm leading-relaxed p-4 bg-white border border-gray-100 rounded-lg">
                            {data?.data?.changelog}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col bg-white rounded-lg border border-solid border-[#ebebeb] p-5 gap-8 mb-10">
                <h2 className="text-2xl font-semibold text-[#2b373a]">
                  {dictionary.comments}
                </h2>
                <div className="flex flex-col">
                  <h3 className="text-[#2b373a] text-xl font-medium mb-3">
                    {dictionary.leave_a_comment}
                  </h3>
                  <p className="text-[#666] text-base font-normal mb-8">
                    {dictionary.email_not_published}
                  </p>
                  <CommentFrom data={data} />
                  <div className="flex flex-col mt-16">
                    {data?.data?.comments?.length ? (
                      <div className="flex flex-col gap-8">
                        {data?.data?.comments?.map((comt, key) => (
                          <CommentsList key={key} comt={comt} />
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-6 md:w-[350px] w-full ">
              <div className="flex flex-col justify-center items-center gap-3 bg-white rounded-lg border border-solid border-[#ebebeb] p-5">
                <div className="text-black py-3 text-2xl font-bold text-center uppercase" suppressHydrationWarning>
                  {data?.data?.file_size ? `${data.data.file_size.toUpperCase()} MB` : ''}
                </div>
                <StarRating
                  initialRating={data?.data?.rating_value}
                  slug={data?.data?.slugs}
                />

                {/* Trust Badges */}
                <div className="w-full space-y-2 mt-2">
                  {data?.data?.virustotal_link && (
                    <a href={data?.data?.virustotal_link} target="_blank" rel="nofollow noopener" className="w-full flex items-center justify-center gap-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 py-2.5 rounded-lg text-sm font-semibold transition">
                      <ShieldCheck size={18} /> 100% Clean / Safe
                    </a>
                  )}
                  {data?.data?.zip_password && (
                    <div className="w-full flex items-center justify-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 py-2.5 rounded-lg text-sm font-semibold cursor-copy" onClick={() => { navigator.clipboard.writeText(data?.data?.zip_password); alert('Password copied!'); }}>
                      <Lock size={18} /> Pass: {data?.data?.zip_password}
                    </div>
                  )}
                </div>

                {downloadMirrors.length > 0 ? (
                  <div className="w-full flex flex-col gap-2 mt-4">
                    {downloadMirrors.map((mirror, idx) => (
                      <a key={idx} href={mirror.url} target="_blank" rel="nofollow noopener" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#2162e2] to-[#1a51bd] hover:from-[#1a51bd] hover:to-[#14429e] text-white py-3.5 rounded-lg text-[15px] font-bold shadow-md transition">
                        <Download size={18} /> Download via {mirror.name}
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="w-full mt-4">
                    <ButtonLink
                      label={dictionary.direct_download}
                      href={`/${locale}/download/${data?.data?.slugs}`}
                    />
                  </div>
                )}

                <ReportLinkButton blogId={data?.data?.id} />
              </div>
              <div className="flex flex-col gap-3 bg-white rounded-lg border border-solid border-[#ebebeb] p-5">
                <div className="text-black py-3 text-lg font-bold">
                  {dictionary.product_info}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-3 border-b border-gray-300/50 py-3">
                    <div className="text-sm text-black font-medium min-w-20">
                      {dictionary.file_name}
                    </div>
                    <div className="text-sm text-[#666] font-medium">
                      {data?.data?.title} {data?.data?.software_version}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-gray-300/50 py-3">
                    <div className="text-sm text-black font-medium">
                      {dictionary.created_by}
                    </div>
                    <div className="text-sm text-[#666] font-medium">
                      {data?.data?.publisher_name}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-gray-300/50 py-3">
                    <div className="text-sm text-black font-medium">
                      {dictionary.version}
                    </div>
                    <div className="text-sm text-[#666] font-medium">
                      {data?.data?.software_version}
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-gray-300/50 py-3">
                    <div className="text-sm text-black font-medium">
                      {dictionary.license_type}
                    </div>
                    <div className="text-sm text-[#666] font-medium">
                      full_version
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-b border-gray-300/50 py-3">
                    <div className="text-sm text-black font-medium">
                      {dictionary.release_date}
                    </div>
                    <h4 className="text-sm text-[#666] font-medium" suppressHydrationWarning>
                      {moment(data?.data?.created_at).format("MMM DD, YYYY")}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between gap-3 border-b border-gray-300/50 py-3">
                    <div className="text-sm text-black font-medium">
                      {dictionary.languages}
                    </div>
                    <div className="text-sm text-[#666] font-medium">
                      {dictionary.multilingual}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4 sticky bg-white  border border-[#ebebeb] p-6 rounded">
                <div className="border-b border-solid mb-4 pb-6">
                  <h3 className="text-lg font-bold">
                    {dictionary.related_recommended}
                  </h3>
                </div>

                <div className="flex flex-col gap-4">
                  {subCategoriesList?.length ? (
                    <>
                      {subCategoriesList.map((item, index) => (
                        <RemandedBlogCard
                          item={item}
                          index={index}
                          subCategoryData={subCategoryData}
                          locale={locale}
                        />
                      ))}
                    </>
                  ) : (
                    <p className="text-sm">{dictionary.data_not_found}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {jsonLd.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </>
    );
  } else {
    return <p>Failed to fetch the data from database.</p>;
  }
}
