import React from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';

import { useSidebar } from '~/lib/stores';

import { IconPanel, MainPanel, SidePanel } from '~/components/panels';
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
    <div className='font-sans'>
      <div className='h-full max-h-screen w-full flex-row overflow-hidden flex'>
        <IconPanel />
        <ResizablePanelGroup
          direction='horizontal'
          autoSaveId='side-main-group'
        >
          <ResizablePanel
            ref={sidebarPanel}
            minSize={10}
            defaultSize={18}
            collapsible
            collapsedSize={0}
          >
            <SidePanel />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={80} maxSize={100} minSize={20}>
            <MainPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default Home;
