import { HashRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';

import '~/assets/index.css';
import { ThemeProvider } from '~/components/theme-provider';
import { Toaster } from '~/components/ui/sonner';

import { QueryClient, QueryClientProvider } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';

import ErrorPage from './pages/error';

const queryClient = new QueryClient();

import Home from '~/pages/home';

function App() {
  return (
    <ErrorBoundary fallback={<ErrorPage />}>
      <ThemeProvider defaultTheme='light' storageKey='theme'>
        <QueryClientProvider client={queryClient}>
          <HashRouter>
            <Routes>
              <Route path={'/'} element={<Home />} />
            </Routes>
          </HashRouter>
          <Toaster position='top-right' />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
