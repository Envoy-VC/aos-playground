import React from 'react';
import { ImperativePanelHandle } from 'react-resizable-panels';

import { useEditorConfig, useTheme } from '~/lib/hooks';
import { useSidebar } from '~/lib/stores';
import { editorThemes } from '~/lib/themes';

import { IconPanel, MainPanel, SidePanel } from '~/components/panels';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable';

const Home = () => {
  const { setPanel } = useSidebar();
  const { theme } = useTheme();
  const { editorOptions } = useEditorConfig();
  const sidebarPanel = React.useRef<ImperativePanelHandle | null>(null);

  React.useEffect(() => {
    if (sidebarPanel.current) {
      setPanel(sidebarPanel.current);
    }
  }, [sidebarPanel]);

  React.useEffect(() => {
    const root = document.documentElement;
    const editorTheme =
      theme === 'dark' ? editorOptions.darkTheme : editorOptions.lightTheme;
    const currentEditorTheme = editorThemes.find((t) => t.name === editorTheme);
    if (!currentEditorTheme) return;
    const backgroundColor = currentEditorTheme.colors['editor.background'];
    const popoverColor = currentEditorTheme.colors['activityBar.background'];
    const accentBg = currentEditorTheme.colors['activityBarBadge.background'];

    Object.entries(currentEditorTheme.colors).forEach(([key, value]) => {
      const variable = '--' + key.split('.').join('-');
      root.style.setProperty(variable, value);
    });

    root.style.setProperty('--background', backgroundColor);
    root.style.setProperty('--popover', popoverColor);
    root.style.setProperty('--accent', accentBg);
  }, [editorOptions, theme]);

  return (
    <div className='font-sans bg-background'>
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
