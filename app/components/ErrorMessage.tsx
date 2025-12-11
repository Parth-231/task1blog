"use client";

import React from "react";

export default function ErrorMessage({ error }: { error?: any }) {
  const message = typeof error === "string" ? error : error?.message ?? String(error);
  return (
    <div className="text-center text-red-600 py-8">
      <p className="font-semibold mb-2">Error</p>
      <p>{message}</p>
    </div>
  );
}
