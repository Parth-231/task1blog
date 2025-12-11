"use client";

import React from "react";

export default function NotFound({ resource = "Page" }: { resource?: string }) {
  return (
    <div className="text-center text-gray-600 py-8">
      <p className="text-xl font-semibold mb-2">{resource} not found</p>
      <p>We couldn't find what you're looking for.</p>
    </div>
  );
}
