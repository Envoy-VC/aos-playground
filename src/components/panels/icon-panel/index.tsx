import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

import { useSidebar } from '~/lib/stores';

import { Files, Bolt, Cpu } from 'lucide-react';

import PlaygroundLogo from '~/components/logo';

const IconPanel = () => {
  const { activeKey, panel, setActiveKey } = useSidebar();
  return (
    <div className='h-screen'>
      <PlaygroundLogo />
      <div className='flex h-full w-fit flex-col justify-between border-r border-neutral-200 py-2 dark:border-neutral-700'>
        <div className='flex flex-col gap-3'>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <div className='relative px-4 py-2'>
                      {item.key === activeKey && (
                        <div className='absolute left-0 top-0 h-full w-[4px] rounded-r-full bg-blue-500'></div>
                      )}
                      <Icon
                        size={28}
                        absoluteStrokeWidth
                        className='text-neutral-500 dark:text-neutral-300'
                        onClick={() => {
                          if (item.key === activeKey) {
                            panel?.isCollapsed()
                              ? panel?.expand()
                              : panel?.collapse();
                          } else {
                            setActiveKey(item.key);
                          }
                        }}
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default IconPanel;

export const sidebarItems = [
  {
    title: 'Files',
    icon: Files,
    key: 'files',
  },
  {
    title: 'Processes',
    icon: Cpu,
    key: 'processes',
  },
  {
    title: 'Settings',
    icon: Bolt,
    key: 'settings',
  },
] as const;
