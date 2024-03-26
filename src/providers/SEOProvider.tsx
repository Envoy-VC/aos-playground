import React from 'react';
import { HelmetProvider } from 'react-helmet-async';

const SEOProvider = ({ children }: React.PropsWithChildren) => {
  return <HelmetProvider>{children}</HelmetProvider>;
};

export default SEOProvider;
