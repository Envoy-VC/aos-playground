import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorScreen } from '~/screens';

const ErrorProvider = ({ children }: React.PropsWithChildren) => {
  return <ErrorBoundary fallback={<ErrorScreen />}>{children}</ErrorBoundary>;
};

export default ErrorProvider;
