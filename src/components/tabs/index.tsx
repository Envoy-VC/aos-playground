import { db } from '~/lib/db';
import { useEditorConfig } from '~/lib/hooks';
import { useEditor } from '~/lib/stores';

import ThemeSwitcher from '~/components/ui/theme-switch';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

import ConnectButton from '../connect-button';
import { Button } from '../ui/button';
import DebugFilePill from './DebugFilePill';
import Run from './Run';
import TabPill from './TabPill';

import { useLiveQuery } from 'dexie-react-hooks';
import { ZoomIn, ZoomOut } from 'lucide-react';

const Tabs = () => {
  const { monaco } = useEditor();

  const { editorOptions, setEditorConfig } = useEditorConfig();

  const tabs = useLiveQuery(async () => {
    const tabs = await db.tabs.toArray();
    return tabs;
  });

  const handleZoom = (type: 'in' | 'out') => {
    if (!monaco) return;
    const currentSize = monaco.getRawOptions().fontSize ?? 15;

    const newSize = type === 'in' ? currentSize + 1 : currentSize - 1;

    monaco.updateOptions({
      fontSize: newSize,
    });

    setEditorConfig({ ...editorOptions, fontSize: newSize });
  };

  return (
    <div className='flex h-[4dvh] flex-row items-center justify-between border-b px-4'>
      <div className='flex flex-row items-center overflow-x-scroll hide-scrollbar'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                onClick={() => handleZoom('out')}
                className='!m-0 h-fit !p-2'
              >
                <ZoomOut size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom out</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant='ghost'
                onClick={() => handleZoom('in')}
                className='!m-0 h-fit !p-2'
              >
                <ZoomIn size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Zoom in</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className='overflow-scroll max-w-fit flex hide-scrollbar'>
          <div className='flex flex-row items-center'>
            <DebugFilePill />
            {tabs?.map((tab) => <TabPill key={tab.path} path={tab.path} />)}
          </div>
        </div>
      </div>
      <div className='flex flex-row items-center gap-2 pl-4'>
        <Run />
        <ThemeSwitcher />
        <ConnectButton />
      </div>
    </div>
  );
};

export default Tabs;
