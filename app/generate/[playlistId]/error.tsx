"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Captured Error:", error);
  }, [error]);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1 style={{ color: "red" }}>Something went wrong</h1>
      <p>{error.message}</p>
      <button
        onClick={reset}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "black",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Try Again
      </button>
    </div>
  );
}
