import { notFound } from "next/navigation";
import { getBlogDetail, getBlogsBySubCategory } from "@/utils/apis";
import SetTitle from "@/components/SetTitle";
import DownloadClient from "./DownloadClient";
import RemandedBlogCard from "@/components/RemandedBlogCard";
import { ShieldCheck, Lock, DownloadCloud } from "lucide-react";

export async function generateMetadata({ params }) {
    const resolvedParams = await params;
    const { locale, slug } = resolvedParams;
    const data = await getBlogDetail(slug, locale);

    if (!data?.status) {
        return { title: 'Download Not Found' };
    }

    return {
        title: `Download ${data?.data?.software_name} ${data?.data?.software_version}`,
        description: `Direct download page for ${data?.data?.software_name}`,
        robots: {
            index: false,
            follow: false,
        }
    };
}

export default async function DownloadPage({ params }) {
    const resolvedParams = await params;
    const { locale, slug } = resolvedParams;

    const data = await getBlogDetail(slug, locale);

    if (!data?.status) {
        notFound();
    }

    const subCategoryData = await getBlogsBySubCategory(
        data?.data?.subcategory?.slug
    );

    let subCategoriesList = subCategoryData?.data?.data || [];

    if (subCategoriesList.length) {
        // Filter out the current software so it doesn't show in related
        subCategoriesList = subCategoriesList.filter(
            (item) => item.slugs !== slug
        ).slice(0, 5); // Limit to 5 related posts
    }

    return (
        <>
            <SetTitle title={`Download ${data?.data?.software_name}`} />
            <div className="margins min-h-[70vh] py-10 bg-[#f4f7f6]">
                <div className="max-w-[800px] mx-auto flex flex-col gap-6">

                    {/* Main Download Card */}
                    <div className="bg-white rounded-xl border border-[#ebebeb] p-8 shadow-sm flex flex-col items-center justify-center text-center">

                        <div className="w-20 h-20 bg-[#f0f9f6] rounded-full flex items-center justify-center mb-4 text-[#00856f]">
                            <DownloadCloud size={40} />
                        </div>

                        <h1 className="text-3xl font-bold text-[#2b373a] mb-2">
                            Thanks for Downloading
                        </h1>
                        <h2 className="text-xl font-medium text-[#00856f] mb-8">
                            {data?.data?.software_name} {data?.data?.software_version}
                        </h2>

                        {/* Client Component that handles the countdown and actual link reveal */}
                        <DownloadClient
                            downloadLink={data?.data?.downloadable_link}
                            fileName={`${data?.data?.software_name} ${data?.data?.software_version}`}
                            mirrors={data?.data?.download_mirrors}
                        />

                        {/* Trust Badges / Info */}
                        <div className="mt-8 pt-6 border-t border-gray-100 w-full flex flex-col items-center gap-3">
                            {data?.data?.zip_password && (
                                <div className="text-red-500 font-bold text-lg flex items-center gap-2">
                                    The password for Zip file is: <span className="bg-red-50 px-3 py-1 rounded border border-red-100">{data?.data?.zip_password}</span>
                                </div>
                            )}
                            {data?.data?.virustotal_link && (
                                <a href={data?.data?.virustotal_link} target="_blank" rel="nofollow noopener" className="text-emerald-600 text-sm font-medium flex items-center gap-1 hover:underline">
                                    <ShieldCheck size={16} /> 100% Clean Source (VirusTotal Checked)
                                </a>
                            )}
                            <div className="text-sm text-gray-500 mt-2">
                                For more help please visit <a href="/faqs" className="text-[#00856f] hover:underline">Faqs</a>
                            </div>
                        </div>

                    </div>

                    {/* Related Posts Section */}
                    <div className="bg-white rounded-xl border border-[#ebebeb] p-6 shadow-sm">
                        <h3 className="text-xl font-bold text-[#2b373a] mb-6 border-l-4 border-[#00856f] pl-3">
                            Related posts
                        </h3>

                        <div className="flex flex-col gap-4">
                            {subCategoriesList?.length ? (
                                subCategoriesList.map((item, index) => (
                                    <RemandedBlogCard
                                        key={index}
                                        item={item}
                                        index={index}
                                        subCategoryData={subCategoryData}
                                    />
                                ))
                            ) : (
                                <p className="text-sm text-gray-500 italic">No related posts found.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}
