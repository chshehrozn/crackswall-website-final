import SelectCategoryLink from "./SelectCategoryLink";
import SelectSubCategoryLink from "./SelectSubCategoryLink";

import { getCategoriesData, getSubCategoriesData } from "@/utils/apis";

const CategoryFilter = async ({ categorySlug, subCategorySlug, locale = 'en' }) => {
  const categoriesData = await getCategoriesData(locale);

  let subCategoriesData = { subcategory: [], data: [] };
  if (categorySlug) {
    subCategoriesData = await getSubCategoriesData(categorySlug, locale).catch(
      (err) => {
        console.error("Error fetching subcategories data:", err);
        return { subcategory: [], data: [] };
      }
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4 sticky bg-white  border border-[#ebebeb] p-6 rounded">
        <h3 className="text-xl font-bold pb-4 mb-3 border-b border-solid border-[#ebebeb]">
          Primary Category
        </h3>
        {categoriesData?.length ? (
          <>
            {categoriesData?.map((item, index) => (
              <SelectCategoryLink
                item={item}
                index={index}
                categorySlug={categorySlug}
                locale={locale}
              />
            ))}
          </>
        ) : null}
      </div>
      <div className="flex flex-col gap-4 sticky bg-white  border border-[#ebebeb] p-6 rounded">
        <h3 className="text-xl font-bold pb-4 mb-3 border-b border-solid border-[#ebebeb]">
          Sub Category
        </h3>
        {subCategoriesData?.subcategory?.length ? (
          <>
            {subCategoriesData?.subcategory?.map((item, index) => (
              <>
                {categorySlug ? (
                  <SelectSubCategoryLink
                    item={item}
                    index={index}
                    categorySlug={categorySlug}
                    subCategorySlug={subCategorySlug}
                    locale={locale}
                  />
                ) : null}
              </>
            ))}
          </>
        ) : null}
      </div>
    </>
  );
};
export default CategoryFilter;
