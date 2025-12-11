// // app/layout.tsx
// import "./globals.css";
// import { Providers } from "./providers";

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <head>
//         {/* This runs instantly on HTML parse — before React hydrates */}
//         <script
//           dangerouslySetInnerHTML={{
//             __html: `
//               (function() {
//                 try {
//                   const theme = localStorage.getItem('theme');
//                   if (theme === 'dark' || 
//                     (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
//                   ) {
//                     document.documentElement.classList.add('dark');
//                   } else {
//                     document.documentElement.classList.remove('dark');
//                   }
//                 } catch (_) {}
//               })();
//             `,
//           }}
//         />
//       </head>

//       <body className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
//         <Providers>{children}</Providers>
//       </body>
//     </html>
//   );
// }









import './globals.css';           // ← This is correct (first import!)
import { Providers } from './providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}