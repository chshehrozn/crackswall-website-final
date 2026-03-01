"use client";

export default function GlobalError({ error, reset }) {
    return (
        <html lang="en">
            <body>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "16px",
                    minHeight: "100vh",
                    backgroundColor: "#EBEEF2",
                    fontFamily: "sans-serif",
                }}>
                    <h1 style={{ fontSize: "1.5rem", fontWeight: 500, color: "#1f2937", textAlign: "center" }}>
                        Something went wrong!
                    </h1>
                    <p style={{ color: "#4b5563", textAlign: "center", maxWidth: "28rem" }}>
                        {error?.message || "An unexpected error occurred."}
                    </p>
                    <button
                        onClick={() => reset()}
                        style={{
                            padding: "12px 24px",
                            backgroundColor: "#9333ea",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "1rem",
                        }}
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    );
}
