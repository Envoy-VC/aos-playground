import { sidebarItems } from '~/lib/data';
import { useSidebar } from '~/lib/stores';
import { cn } from '~/lib/utils';

import PlaygroundLogo from '~/components/logo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

const IconPanel = () => {
  const { activeKey, panel, isCollapsed, setActiveKey, setIsCollapsed } =
    useSidebar();
  return (
    <div
      className={cn(
        'h-screen border-neutral-200 bg-[#f9f9f9] dark:border-neutral-700 dark:bg-[#21232f]',
        isCollapsed ? 'border-none' : 'border-r'
      )}
    >
      <PlaygroundLogo />
      <div className={cn('flex h-full w-fit flex-col justify-between py-2')}>
        <div className='flex flex-col gap-3'>
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <TooltipProvider key={item.key}>
                <Tooltip>
                  <TooltipTrigger>
                    <div className='relative px-4 py-2'>
                      {item.key === activeKey && (
                        <div className='absolute left-0 top-0 h-full w-[4px] rounded-r-full bg-blue-500'></div>
                      )}
                      <Icon
                        size={24}
                        absoluteStrokeWidth
                        className={cn(
                          item.key === activeKey
                            ? 'text-neutral-900 dark:text-neutral-50'
                            : 'text-neutral-500 dark:text-neutral-400'
                        )}
                        onClick={() => {
                          if (item.key === activeKey) {
                            panel?.isCollapsed()
                              ? panel?.expand()
                              : panel?.collapse();

                            setIsCollapsed(!!panel?.isCollapsed());
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
