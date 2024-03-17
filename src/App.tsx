import { HashRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import '~/assets/index.css';
import { ThemeProvider } from '~/components/theme-provider';
import { Toaster } from '~/components/ui/sonner';

import { QueryClient, QueryClientProvider } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';
import { ArweaveWalletKit } from 'arweave-wallet-kit';

import ErrorPage from './pages/error';

const queryClient = new QueryClient();

import Home from '~/pages/home';

function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <ArweaveWalletKit
        config={{
          permissions: [
            'ACCESS_ALL_ADDRESSES',
            'ACCESS_ARWEAVE_CONFIG',
            'ACCESS_PUBLIC_KEY',
            'DISPATCH',
            'SIGN_TRANSACTION',
            'SIGNATURE',
            'ACCESS_ADDRESS',
            'ENCRYPT',
            'DECRYPT',
          ],
          ensurePermissions: true,
        }}
      >
        <ThemeProvider defaultTheme='light' storageKey='theme'>
          <QueryClientProvider client={queryClient}>
            <HashRouter>
              <Routes>
                <Route path={'/'} element={<Home />} />
              </Routes>
            </HashRouter>
          </QueryClientProvider>
          <Toaster position='top-right' />
        </ThemeProvider>
      </ArweaveWalletKit>
    </ErrorBoundary>
  );
}

export default App;
