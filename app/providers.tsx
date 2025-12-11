// 'use client';

// import { Provider } from 'react-redux';
// import { store } from '@/redux/store';

// export function Providers({ children }: { children: React.ReactNode }) {
//   return <Provider store={store}>{children}</Provider>;
// }






// app/providers.tsx
'use client';

import { Provider } from 'react-redux';
import { ThemeProvider } from 'next-themes';
import { store } from '@/redux/store';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"           
        defaultTheme="system"       
        enableSystem                
        enableColorScheme           
        storageKey="theme"          
      >
        {children}
      </ThemeProvider>
    </Provider>
  );
}