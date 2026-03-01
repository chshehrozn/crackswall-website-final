"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoadingStore } from "@/app/store/loadingStore";

export default function NavigationEvents() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const setIsLoading = useLoadingStore((state) => state.setIsLoading);

    useEffect(() => {
        // When pathname or searchParams change, it means navigation completed
        setIsLoading(false);
    }, [pathname, searchParams, setIsLoading]);

    return null;
}
