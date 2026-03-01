'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children, initialTheme }) {
    const [theme, setTheme] = useState(initialTheme);

    useEffect(() => {
        if (initialTheme) setTheme(initialTheme);
    }, [initialTheme]);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data && event.data.type === 'THEME_UPDATE') {
                const themeData = event.data.theme;
                setTheme(themeData);

                // Update CSS variables real-time
                if (themeData.site) {
                    document.documentElement.style.setProperty('--primary-color', themeData.site.primaryColor);
                    document.documentElement.style.setProperty('--secondary-color', themeData.site.secondaryColor);

                    // Update Favicon and Title real-time
                    if (themeData.site.favicon) {
                        let link = document.querySelector("link[rel~='icon']");
                        if (!link) {
                            link = document.createElement('link');
                            link.rel = 'icon';
                            document.getElementsByTagName('head')[0].appendChild(link);
                        }
                        link.href = themeData.site.favicon;
                    }
                    if (themeData.site.name) {
                        document.title = themeData.site.name;
                    }
                }
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
