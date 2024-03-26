import ArweaveProvider from './ArweaveProvider';
import ErrorProvider from './ErrorProvider';
import QueryProvider from './QueryProvider';
import SEOProvider from './SEOProvider';
import ThemeProvider from './ThemeProvider';

const ProviderTree = ({ children }: React.PropsWithChildren) => {
  return (
    <ErrorProvider>
      <ThemeProvider defaultTheme='light' storageKey='theme'>
        <ArweaveProvider>
          <SEOProvider>
            <QueryProvider>{children}</QueryProvider>
          </SEOProvider>
        </ArweaveProvider>
      </ThemeProvider>
    </ErrorProvider>
  );
};

export default ProviderTree;
