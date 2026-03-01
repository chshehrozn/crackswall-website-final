"use client";

export default function Error({ error, reset }) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 min-h-screen bg-[#EBEEF2]">
            <h1 className="text-2xl font-medium text-gray-800 text-center mb-4">
                Something went wrong!
            </h1>
            <p className="text-gray-600 text-center max-w-md">
                {error?.message || "An unexpected error occurred."}
            </p>
            <button
                onClick={() => reset()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
                Try Again
            </button>
        </div>
    );
}
