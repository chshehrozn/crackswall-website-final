"use client";

import React, { createContext, useContext } from "react";

const TranslationContext = createContext({});

export const TranslationProvider = ({ dictionary, children }) => {
    return (
        <TranslationContext.Provider value={dictionary}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = () => {
    return useContext(TranslationContext);
};
