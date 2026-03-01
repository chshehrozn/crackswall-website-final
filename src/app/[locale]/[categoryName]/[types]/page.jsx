import SubCategoryPage from "../SubCategoryPage/page";
import BlogDetailPage from "../BlogDetailPage/page";
import {
  getSubCategoriesData,
  getCategoriesList,
  postComment,
  getBlogDetail
} from "@/utils/apis";
import { notFound } from "next/navigation";

export async function generateMetadata({ params, searchParams }, parent) {
  const resolvedParams = await params;
  const { locale, categoryName, types } = resolvedParams;

  const [subCategoriesData, blogRes] = await Promise.all([
    getSubCategoriesData(categoryName),
    getBlogDetail(types, locale).catch(() => null)
  ]);

  const matchingSubcategory = subCategoriesData?.subcategory?.find(
    (subcategory) =>
      subcategory.is_type === "subcategory" && subcategory.slug === types
  );

  const currentUrl = `${process.env.NEXT_PUBLIC_WEB_URL}/${categoryName}/${types}`;
  const siteName = process.env.NEXT_PUBLIC_PROJECT_NAME || "CracksWall";

  if (matchingSubcategory?.slug === types) {
    return {
      title: `${matchingSubcategory.title || categoryName} Software for ${categoryName} - ${siteName}`,
      description: `Free download Windows programs, plugins, codecs, drivers, tools, utilities, gaming tools, mobile phone tools, and operating systems.`,
      alternates: { canonical: currentUrl },
      robots: { index: true, follow: true },
      openGraph: {
        url: currentUrl,
        title: `${matchingSubcategory.title || categoryName} | ${siteName}`,
      }
    };
  } else if (blogRes?.status) {
    const blog = blogRes.data;
    const title = `${blog.software_name || blog.title} ${blog.software_version || ''} - Latest Free Download - ${siteName}`;
    const description = `Free Download ${blog.software_name || blog.title} ${blog.software_version || ''} Offline Installer Latest Version - ${blog.software_description || "Secure & Private"}.`;

    return {
      title,
      description,
      keywords: `${blog.software_name || blog.title}, ${blog.software_version || ''}, free download, ${blog.application_category || ''}, ${categoryName}`,
      alternates: {
        canonical: currentUrl,
      },
      robots: {
        index: true,
        follow: true,
      },
      authors: [{ name: blog.publisher_name || siteName }],
      publisher: siteName,
      openGraph: {
        title,
        description,
        url: currentUrl,
        type: 'article',
        siteName: siteName,
        locale: "en_US",
        publishedTime: `${blog.created_date || ''}T${blog.created_time || ''}`,
        modifiedTime: blog.date_modified || undefined,
        authors: [blog.publisher_name || siteName],
        tags: [blog.application_category || '', blog.operating_system || ''].filter(Boolean),
        images: blog.images?.map(img => ({
          url: img.image_path?.startsWith('http') ? img.image_path : `${process.env.NEXT_PUBLIC_WEB_URL}/${img.image_path?.replace(/^public\//, '')}`,
          width: 836,
          height: 484,
          alt: `${blog.software_name || blog.title} ${blog.software_version || ''}`
        }))
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        creator: `@${siteName.replace(/\s+/g, '')}`,
        site: `@${siteName.replace(/\s+/g, '')}`,
      }
    };
  }

  return {};
}

export default async function TypePage({ params }) {
  const resolvedParams = await params;
  const { locale, categoryName, types } = resolvedParams;
  const currentUrl = `${process.env.NEXT_PUBLIC_WEB_URL}`;
  const [subCategoriesData, _categoriesRes, response] = await Promise.all([
    getSubCategoriesData(categoryName),
    getCategoriesList({ url: currentUrl }),
    postComment({ url: currentUrl })
  ]);

  // Find the matching subcategory
  const matchingSubcategory = subCategoriesData?.subcategory?.find(
    (subcategory) =>
      subcategory.is_type === "subcategory" && subcategory.slug === types
  );
  if (!response?.status) {
    notFound();
  }
  if (matchingSubcategory?.slug === types) {
    return <SubCategoryPage categoryName={categoryName} types={types} locale={locale} />;
  } else {
    return <BlogDetailPage categoryName={categoryName} types={types} locale={locale} />;
  }
}
