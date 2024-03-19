import React from 'react';

import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '~/components/theme-provider';
import ArweaveProvider from './arweave';

import { QueryClient, QueryClientProvider } from 'react-query';
import { ErrorBoundary } from 'react-error-boundary';

import ErrorPage from '~/pages/error';

const ProviderTree = ({ children }: React.PropsWithChildren) => {
  const queryClient = new QueryClient();

  return (
    <div>
      <ErrorBoundary fallback={<ErrorPage />}>
        <ThemeProvider defaultTheme='light' storageKey='theme'>
          <ArweaveProvider>
            <HelmetProvider>
              <QueryClientProvider client={queryClient}>
                {children}
              </QueryClientProvider>
            </HelmetProvider>
          </ArweaveProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </div>
  );
};

export default ProviderTree;
