"use client";

import React from "react";

export default function Loading({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600 mr-3" />
      <span className="text-gray-600">{message}</span>
    </div>
  );
}
