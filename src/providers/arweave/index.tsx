import React from 'react';

import { useTheme } from '~/components/theme-provider';

import { ArweaveWalletKit } from 'arweave-wallet-kit';

const ArweaveProvider = ({ children }: React.PropsWithChildren) => {
  const { theme } = useTheme();

  return (
    <ArweaveWalletKit
      theme={{
        displayTheme: theme,
      }}
      config={{
        permissions: [
          'ACCESS_ALL_ADDRESSES',
          'SIGN_TRANSACTION',
          'ACCESS_ADDRESS',
        ],
        ensurePermissions: true,
      }}
    >
      {children}
    </ArweaveWalletKit>
  );
};

export default ArweaveProvider;
