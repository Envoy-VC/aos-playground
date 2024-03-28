import ArweaveProvider from './ArweaveProvider';
import ErrorProvider from './ErrorProvider';
import QueryProvider from './QueryProvider';
import ThemeProvider from './ThemeProvider';

const ProviderTree = ({ children }: React.PropsWithChildren) => {
  return (
    <ErrorProvider>
      <ThemeProvider defaultTheme='light' storageKey='theme'>
        <ArweaveProvider>
          <QueryProvider>{children}</QueryProvider>
        </ArweaveProvider>
      </ThemeProvider>
    </ErrorProvider>
  );
};

export default ProviderTree;
