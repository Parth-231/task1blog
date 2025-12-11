import React from "react";
import { notFound } from "next/navigation";

import ArticleClient from "./ArticleClient";

export default async function Page({ params }: { params: { slug: string } | Promise<{ slug: string }> }) {
	const resolvedParams = await params;
	const id = Number(resolvedParams.slug);

	if (Number.isNaN(id)) return notFound();

	return <ArticleClient id={String(id)} />;
}
