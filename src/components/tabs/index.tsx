import { db } from '~/lib/db';
import { useEditor } from '~/lib/stores';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

import { EditorConfig, defaultConfig } from '~/types';

import ConnectButton from '../connect-button';
import { ThemeSwitcher } from '../theme-provider';
import { Button } from '../ui/button';
import Run from './Run';
import TabPill from './TabPill';

import { useLiveQuery } from 'dexie-react-hooks';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { useLocalStorage } from 'usehooks-ts';

const Tabs = () => {
  const { monaco } = useEditor();

  const [editorOptions, setEditorConfig] = useLocalStorage<EditorConfig>(
    'editorOptions',
    defaultConfig
  );

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
    <div className='flex h-[4dvh] flex-row items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-700'>
      <div className='flex flex-row items-center'>
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
        <div className='flex flex-row items-center'>
          {tabs?.map((tab) => <TabPill key={tab.path} path={tab.path} />)}
        </div>
      </div>
      <div className='flex flex-row items-center gap-2'>
        <Run />
        <ThemeSwitcher />
        <ConnectButton />
      </div>
    </div>
  );
};

export default Tabs;
