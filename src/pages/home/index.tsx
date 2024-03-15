import React from 'react';
import { SEO } from '~/components';

import { IconPanel, MainPanel, SidePanel } from '~/components/panels';

import { ImperativePanelHandle } from 'react-resizable-panels';
import { useSidebar } from '~/lib/stores';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable';

const Home = () => {
  const { setPanel } = useSidebar();
  const sidebarPanel = React.useRef<ImperativePanelHandle | null>(null);

  React.useEffect(() => {
    if (sidebarPanel.current) {
      setPanel(sidebarPanel.current);
    }
  }, [sidebarPanel]);

  return (
    <>
      <SEO
        type='website'
        title='Home Page'
        description='This is the home page'
        ogImage='https://atomic-toolkit-demo.vercel.app/api/og'
      />
      <div className='hidden h-full max-h-screen w-full flex-row overflow-hidden dark:bg-dark  dark:text-white lg:flex'>
        <IconPanel />
        <ResizablePanelGroup direction='horizontal'>
          <ResizablePanel
            ref={sidebarPanel}
            minSize={10}
            defaultSize={14}
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
    </>
  );
};

export default Home;
