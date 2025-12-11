
import Link from "next/link";

export default function BlogCard({
  article,
  index,
}: {
  article: {
    id: number;
    title: string;
    description: string;
    url: string;
    cover_image?: string;
    published_at: string;
    tags: string[];
    user: { name: string; username: string };
  };
  index?: number;
}) {
  const tagText = Array.isArray(article.tags) ? article.tags.join(', ') : '';

  return (
    <article className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 
           shadow-lg rounded-xl overflow-hidden border-2 border-blue-200 dark:border-indigo-700 
           h-full flex flex-col">
      {article.cover_image && (
        <div className="w-full overflow-hidden h-48">
          <img
            src={article.cover_image}
            alt={article.title}
            className="w-full h-full"
          />
        </div>
      )}

      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-2xl font-bold mb-3 text-blue-900 dark:text-blue-100 line-clamp-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {article.title}
        </h2>

        <p className="text-sm text-gray-700 dark:text-gray-200 mb-2 font-medium">
          By{' '}
          <Link
            href={{
              pathname: `/author/${encodeURIComponent(article.user.username)}`,
              query: index !== undefined ? { from: index } : {},
            }}
            className="font-bold text-indigo-600 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-100 hover:underline transition-colors"
          >
            {article.user.name || 'Unknown Author'}
          </Link>
        </p>

        {tagText && (
          <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 bg-blue-100 dark:bg-indigo-900/50 px-3 py-2 rounded-lg inline-block">
            <span className="font-bold text-indigo-700 dark:text-indigo-200">Tags:</span>{' '}
            <span className="text-gray-700 dark:text-gray-200">{tagText}</span>
          </p>
        )}

        <p className="text-sm text-gray-800 dark:text-gray-300 mb-4 line-clamp-3 leading-relaxed bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg flex-grow">
          {article.description || 'No description available'}
        </p>

        <div className="mt-auto">
          {index !== undefined ? (
            <Link
              href={`/blog/${article.id}?pos=${index}`}
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg"
            >
              Read more...
            </Link>
          ) : (
            <Link
              href={`/blog/${article.id}`}
              className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-2 px-4 rounded-lg transition-all duration-200 text-sm shadow-md hover:shadow-lg"
            >
              Read more...
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}