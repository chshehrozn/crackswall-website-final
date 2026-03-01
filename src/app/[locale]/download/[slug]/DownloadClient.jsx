"use client";

import { useState, useEffect } from "react";
import ButtonLink from "@/components/ButtonLink";
import { DownloadCloud, Download, Loader2 } from "lucide-react";

export default function DownloadClient({ downloadLink, fileName, mirrors }) {
    const [countdown, setCountdown] = useState(5);
    const [isReady, setIsReady] = useState(false);

    let downloadMirrors = [];
    try {
        if (mirrors) {
            downloadMirrors = JSON.parse(mirrors);
        }
    } catch (e) {
        console.error("Invalid download mirrors JSON");
    }

    useEffect(() => {
        // Only run the timer if we are not ready yet
        if (countdown > 0 && !isReady) {
            const timer = setTimeout(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0) {
            setIsReady(true);
        }
    }, [countdown, isReady]);

    if (!isReady) {
        return (
            <div className="flex flex-col items-center justify-center p-6 bg-[#00856f] text-white rounded-full px-8 py-3 w-fit shadow-md">
                <div className="flex items-center gap-3 font-semibold text-lg">
                    <Loader2 size={22} className="animate-spin" />
                    Generating Download Link... {countdown}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center w-full max-w-[400px] mt-2 gap-3 transition-opacity duration-500 ease-in opacity-100">

            {/* Primary Download Button */}
            {downloadLink ? (
                <a
                    href={downloadLink}
                    target="_blank"
                    rel="nofollow noopener"
                    className="w-full flex items-center justify-center gap-2 bg-[#00856f] hover:bg-[#00705a] text-white py-3.5 rounded-lg text-lg font-bold shadow-md transition"
                >
                    <DownloadCloud size={24} /> Download {fileName}
                </a>
            ) : null}

            {/* Alternative Download Mirrors */}
            {downloadMirrors?.length > 0 && (
                <div className="w-full flex flex-col gap-2 mt-2">
                    <div className="text-sm text-gray-400 font-medium mb-1 uppercase tracking-wider">Alternative Mirrors</div>
                    {downloadMirrors.map((mirror, idx) => (
                        <a key={idx} href={mirror.url} target="_blank" rel="nofollow noopener" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#2162e2] to-[#1a51bd] hover:from-[#1a51bd] hover:to-[#14429e] text-white py-3 rounded-lg text-sm font-bold shadow-sm transition">
                            <Download size={16} /> Download via {mirror.name}
                        </a>
                    ))}
                </div>
            )}

        </div>
    );
}
