import axios from "axios";

const translationPromises = new Map();

/**
 * Overlay manual/auto DB translations onto API responses.
 * Uses a Promise-based cache to pool concurrent requests for the same table/locale,
 * achieving the requested <1s feel by eliminating redundant network calls.
 */
export const applyTranslations = async (data, tableName, locale, id = null) => {
  if (!locale || locale === 'en' || !data || (Array.isArray(data) && data.length === 0)) return data;

  try {
    let translations = [];

    if (id) {
      // Priority Sync for a specific ID always goes to the server
      const cmsUrl = getBaseUrl();
      const res = await axios.get(`${cmsUrl}/api/public/translations?locale=${locale}&table=${tableName}&id=${id}`);
      translations = res?.data?.data || [];
    } else {
      // Table-wide sync uses a pooled promise to avoid redundant "waterfall" requests
      const cacheKey = `${locale}_${tableName}`;
      if (!translationPromises.has(cacheKey)) {
        const cmsUrl = getBaseUrl();
        translationPromises.set(cacheKey,
          axios.get(`${cmsUrl}/api/public/translations?locale=${locale}`)
            .then(res => res?.data?.data || [])
            .catch(() => [])
        );
      }
      translations = await translationPromises.get(cacheKey);
    }

    return apply(data, tableName, translations);
  } catch (err) {
    console.warn(`Translation sync warning for ${tableName}:`, err.message);
    return data;
  }
};

const apply = (data, tableName, translations) => {
  if (!translations || translations.length === 0) return data;

  const tableTrans = translations.filter(t => t.table_name === tableName);
  if (tableTrans.length === 0) return data;

  const translateItem = (item) => {
    const itemTrans = tableTrans.filter(t => t.row_id === item.id);
    if (itemTrans.length === 0) return item;

    let translatedItem = { ...item };
    itemTrans.forEach(t => {
      if (t.value && t.value.trim() !== "") {
        // Preserve original value for selective use (e.g. top title in English)
        translatedItem[`original_${t.column_name}`] = item[t.column_name];
        translatedItem[t.column_name] = t.value;
      }
    });
    return translatedItem;
  };

  return Array.isArray(data) ? data.map(translateItem) : translateItem(data);
};

// Helper to get Base URL from Cookie (Magic Link) or Env
const getBaseUrl = () => {
  let url = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000') : (process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:8000');

  if (typeof window !== 'undefined') {
    // Client-side
    const cookies = document.cookie.split('; ');
    const urlCookie = cookies.find(row => row.startsWith('cms_api_url='));
    if (urlCookie) url = decodeURIComponent(urlCookie.split('=')[1]);
  } else {
    // Server-side (Standard next.js cookies() is better but this works too for read-only)
    try {
      const { cookies } = require('next/headers');
      const cookieStore = cookies();
      const urlCookie = cookieStore.get('cms_api_url');
      if (urlCookie) url = urlCookie.value;
    } catch (e) { }
  }

  // Normalize: remove trailing slash and trailing /api (since code appends it)
  return url.trim().replace(/\/$/, '').replace(/\/api$/, '');
};

// Fetch Categories List
export const getCategoriesData = async (locale = 'en') => {
  try {
    const baseUrl = getBaseUrl();
    const response = await axios.get(
      `${baseUrl}/api/categories`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let data = response?.data?.data;
    if (data && locale !== 'en') {
      data = await applyTranslations(data, 'slip_categories', locale);
    }
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return null;
  }
};

// Fetch Theme Settings (from CMS)
export const getThemeData = async () => {
  try {
    const baseUrl = getBaseUrl();
    const response = await axios.get(`${baseUrl}/api/theme`);
    return response?.data;
  } catch (error) {
    console.error("Error fetching theme:", error);
    return null;
  }
};

// Fetch Sub Categories List
export const getSubCategoriesData = async (id, locale = 'en') => {
  try {
    const baseUrl = getBaseUrl();
    const response = await axios.get(
      `${baseUrl}/api/subcategory/${id}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let data = response?.data;
    if (data && locale !== 'en') {
      data = await applyTranslations(data, 'slip_categories', locale);
    }
    return data;
  } catch (error) {
    console.error("Error fetching sub categories:", error);
    return null;
  }
};

// Fetch All Blogs List
export const getAllBlogsData = async (locale = 'en') => {
  try {
    const baseUrl = getBaseUrl();
    const response = await axios?.get(
      `${baseUrl}/api/allblogs`,
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );

    let data = response?.data?.data || [];
    if (data.length > 0 && locale !== 'en') {
      data = await applyTranslations(data, 'blogs', locale);
    }
    return data;
  } catch (error) {
    console.error("Error fetching All Blogs:", error);
    return null;
  }
};

// Fetch All Blogs List
export const getCategoriesList = async ({ url }) => {
  try {
    const response = await axios.post(
      `https://presale-backend-nine.vercel.app/api/searchValue`,
      { slug: url },
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );
    // console.log("What is res", response);
    return response?.data;
  } catch (error) {
    return null;
  }
};

// Fetch blogs for all categories
export const getAllCategoryBlogs = async (locale = 'en') => {
  try {
    const baseUrl = getBaseUrl();
    const response = await axios?.get(
      `${baseUrl}/api/allcategoryblogs`,
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );

    let data = response?.data?.data;
    if (data && locale !== 'en') {
      data = await applyTranslations(data, 'blogs', locale);
    }
    return data;
  } catch (error) {
    console.error("Error fetching All Category Blogs:", error);
    return null;
  }
};

// Fetch blogs by categories i.e Games blogs
// Fetch blogs by categories i.e Games blogs
export const getBlogsByCategory = async (categoryName, locale = 'en') => {
  try {
    const baseUrl = getBaseUrl();
    const response = await axios?.get(
      `${baseUrl}/api/categoryblogs/${categoryName}`,
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
        next: { revalidate: 0 },
      }
    );

    let resData = response?.data;
    if (resData && locale !== 'en') {
      if (Array.isArray(resData)) {
        resData = await applyTranslations(resData, 'blogs', locale);
      } else if (resData.data) {
        resData.data = await applyTranslations(resData.data, 'blogs', locale);
      } else if (resData.blogs) {
        resData.blogs = await applyTranslations(resData.blogs, 'blogs', locale);
      }
    }
    return resData;
  } catch (error) {
    console.error("Error fetching Blogs By Category:", error);
    return null;
  }
};

// Fetch blogs of sub categories i.e Multimedia, Antivirus, etc
export const getBlogsBySubCategory = async (types, locale = 'en') => {
  try {
    const baseUrl = getBaseUrl();
    const response = await axios?.get(
      `${baseUrl}/api/subcategoryblogs/${types}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let resData = response?.data;
    if (resData && locale !== 'en') {
      if (Array.isArray(resData)) {
        resData = await applyTranslations(resData, 'blogs', locale);
      } else if (resData.data) {
        resData.data = await applyTranslations(resData.data, 'blogs', locale);
      }
    }
    return resData;
  } catch (error) {
    console.error("Error fetching Blogs By Sub Category:", error);
    return null;
  }
};

// Fetch Blog Detail
export const getBlogDetail = async (types, locale = 'en') => {
  try {
    const baseUrl = getBaseUrl();
    const response = await axios.get(
      `${baseUrl}/api/blogblogsdetails/${types}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let resData = response?.data;
    if (resData && locale !== 'en') {
      if (resData.data) {
        resData.data = await applyTranslations(resData.data, 'blogs', locale, resData.data.id);
      } else {
        resData = await applyTranslations(resData, 'blogs', locale);
      }
    }
    return resData;
  } catch (error) {
    console.error("Error fetching Blog detail:", error);
    return null;
  }
};

// Fetch All users comments
export const postComment = async ({ url }) => {
  try {
    const response = await axios.post(
      `https://presale-backend-nine.vercel.app/api/search`,
      { slug: url },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // console.log("What is res", response);
    return response?.data;
  } catch (error) {
    return null;
  }
};

// Create Comment
export const postCreateComment = async ({ formData, id }) => {
  try {
    const baseUrl = getBaseUrl();
    const response = await axios.post(
      `${baseUrl}/api/leavecomment/${id}`,
      formData, // Pass the form data in the request body
      {
        headers: {
          "Content-Type": "application/json", // Ensure the correct content type
        },
      }
    );

    return response.data; // Return the server response
  } catch (error) {
    console.error("Error creating comment:", error);
    return null;
  }
};

// Search Blogs
export const getSearchBlogs = async (query, locale = 'en') => {
  try {
    const baseUrl = getBaseUrl();
    const response = await axios.get(
      `${baseUrl}/api/searchblog?name=${query}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let data = response?.data?.data || [];
    if (data.length > 0 && locale !== 'en') {
      data = await applyTranslations(data, 'blogs', locale);
    }
    return data;
  } catch (error) {
    console.error("Error fetching search Blog:", error);
    return null;
  }
};

// Update Rating
export const postUpdateRating = async ({ formData, slug }) => {
  try {
    const baseUrl = getBaseUrl();
    const response = await axios.post(
      `${baseUrl}/api/uploadrating/${slug}`,
      formData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Return the server response
  } catch (error) {
    console.error("Error on give a rating:", error);
    return null;
  }
};

// Fetch Static Page by Slug
export const getPageBySlug = async (slug, locale = 'en') => {
  try {
    const baseUrl = getBaseUrl();
    const response = await axios.get(
      `${baseUrl}/api/pages/${slug}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let data = response?.data;
    if (data && locale !== 'en') {
      data = await applyTranslations(data, 'pages', locale, data.id);
    }
    return data;
  } catch (error) {
    console.error("Error fetching page:", error);
    return null;
  }
};
