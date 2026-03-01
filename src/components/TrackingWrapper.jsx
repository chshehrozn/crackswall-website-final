"use client";

import { useEffect } from "react";
import { usePathname, useParams } from "next/navigation";

export default function TrackingWrapper({ children }) {
    const pathname = usePathname();
    const { locale } = useParams();

    useEffect(() => {
        const trackView = async () => {
            try {
                const apiBaseUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000';
                await fetch(`${apiBaseUrl}/api/track-view`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        url: window.location.href,
                        referer: document.referrer,
                        locale: locale || 'en'
                    })
                });
            } catch (error) {
                console.error("Failed to track view:", error);
            }
        };

        trackView();
    }, [pathname, locale]);

    return <>{children}</>;
}
