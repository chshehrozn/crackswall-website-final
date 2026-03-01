"use client";
import React, { useState } from "react";
import { AlertOctagon } from "lucide-react";
import axios from "axios";
import { useTranslation } from "@/context/TranslationContext";

export default function ReportLinkButton({ blogId }) {
    const [isOpen, setIsOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [status, setStatus] = useState("idle");
    const dictionary = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!reason.trim()) return;

        setStatus("loading");
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}/api/reportlink`, {
                blog_id: blogId,
                reason: reason,
            });
            setStatus("success");
            setTimeout(() => setIsOpen(false), 2000);
        } catch (err) {
            console.error(err);
            setStatus("error");
        }
    };

    return (
        <div className="w-full mt-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 py-2.5 rounded-lg text-sm font-semibold transition"
            >
                <AlertOctagon size={18} /> {dictionary?.report_dead_link || "Report Dead Link / Broken Download"}
            </button>

            {isOpen && (
                <form onSubmit={handleSubmit} className="mt-3 bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-in fade-in slide-in-from-top-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{dictionary?.report_issue_label || "What is the issue?"}</label>
                    <textarea
                        className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 resize-none h-20"
                        placeholder={dictionary?.report_placeholder || "e.g. The download link is 404, or the file size is 0 bytes."}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        disabled={status === "loading" || status === "success"}
                    ></textarea>

                    <div className="flex justify-end gap-2 mt-3">
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
                            className="px-4 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition"
                            disabled={status === "loading"}
                        >
                            {dictionary?.cancel || "Cancel"}
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-1.5 text-sm text-white rounded transition ${status === "success" ? "bg-green-500" : "bg-red-500 hover:bg-red-600"}`}
                            disabled={status === "loading" || status === "success" || !reason.trim()}
                        >
                            {status === "loading" ? (dictionary?.submitting || "Submitting...") : status === "success" ? (dictionary?.reported || "Reported!") : (dictionary?.submit_report || "Submit Report")}
                        </button>
                    </div>
                    {status === "error" && <p className="text-red-500 text-xs mt-2 text-center">{dictionary?.report_error || "Failed to submit report. Please try again."}</p>}
                </form>
            )}
        </div>
    );
}
