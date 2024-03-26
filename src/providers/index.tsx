import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from 'react-query';

import { ThemeProvider } from '~/components/theme-provider';

import ErrorPage from '~/pages/error';

import ArweaveProvider from './arweave';

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
