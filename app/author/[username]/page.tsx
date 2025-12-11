import React from "react";
import AuthorClient from "./AuthorClient";

export default async function Page({ 
  params 
}: { 
  params: { username: string } | Promise<{ username: string }> 
}) {
	const resolvedParams = await params;
	const username = decodeURIComponent(resolvedParams.username);

	return <AuthorClient username={username} />;
}
