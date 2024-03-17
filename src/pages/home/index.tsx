import React from 'react';
// import { SEO } from '~/components';

import { IconPanel, MainPanel, SidePanel } from '~/components/panels';
import { ArweaveWalletKit } from 'arweave-wallet-kit';
import { useTheme } from '~/components/theme-provider';
import { ImperativePanelHandle } from 'react-resizable-panels';
import { useSidebar } from '~/lib/stores';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable';

const Home = () => {
  const { setPanel } = useSidebar();
  const { theme } = useTheme();
  const sidebarPanel = React.useRef<ImperativePanelHandle | null>(null);

  React.useEffect(() => {
    if (sidebarPanel.current) {
      setPanel(sidebarPanel.current);
    }
  }, [sidebarPanel]);

  return (
    <ArweaveWalletKit
      theme={{
        displayTheme: theme,
      }}
      config={{
        permissions: [
          'ACCESS_ALL_ADDRESSES',
          'DISPATCH',
          'SIGN_TRANSACTION',
          'ACCESS_ADDRESS',
        ],
        ensurePermissions: true,
      }}
    >
      <main>
        <div className='hidden h-full max-h-screen w-full flex-row overflow-hidden dark:bg-dark  dark:text-white lg:flex'>
          <IconPanel />
          <ResizablePanelGroup direction='horizontal'>
            <ResizablePanel
              ref={sidebarPanel}
              minSize={10}
              defaultSize={18}
              collapsible
              collapsedSize={0}
            >
              <SidePanel />
            </ResizablePanel>
            <ResizableHandle
              className='bg-neutral-200 dark:bg-neutral-700'
              withHandle
            />
            <ResizablePanel defaultSize={80} maxSize={100} minSize={20}>
              <MainPanel />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        <div className='flex lg:hidden'>
          {/** show warning that Only on large screens  */}
          <div className='flex h-screen w-full items-center justify-center'>
            <p className='text-2xl'>Only on large screens</p>
          </div>
        </div>
      </main>
    </ArweaveWalletKit>
  );
};

export default Home;
