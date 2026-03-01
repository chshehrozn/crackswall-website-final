const dictionaries = {
    en: () => import("./en.json").then((module) => module.default),
    ar: () => import("./ar.json").then((module) => module.default),
    es: () => import("./es.json").then((module) => module.default),
    hi: () => import("./hi.json").then((module) => module.default),
};

export const getDictionary = async (locale) => {
    return dictionaries[locale]?.() ?? dictionaries.en();
};
