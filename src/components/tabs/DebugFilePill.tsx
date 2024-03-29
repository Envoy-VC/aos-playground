import { useDebugFile, useEditor } from '~/lib/stores';
import { cn } from '~/lib/utils';

import { Button } from '~/components/ui/button';

import { BugPlayIcon, X } from 'lucide-react';

const DebugFilePill = () => {
  const { isActive, result, setResult, setIsActive } = useDebugFile();
  const { setActivePath } = useEditor();

  if (!isActive && result.length === 0) {
    return <></>;
  } else {
    return (
      <div
        className={cn(
          'h-[4dvh] min-w-[160px] cursor-pointer border-r flex flex-col',
          isActive
            ? 'bg-[var(--tab-activeBackground)]'
            : 'bg-[var(---tab-inactiveBackground)]'
        )}
      >
        {isActive && <div className='w-full h-1 bg-blue-500'></div>}
        <div className='flex flex-row items-center justify-between gap-2 h-full px-2'>
          <div
            className='flex w-full flex-row items-center gap-2'
            onClick={() => {
              setIsActive(true);
              setActivePath(null);
            }}
          >
            <BugPlayIcon size={16} />
            <div className='text-base'>Debug</div>
          </div>
          <Button
            variant='link'
            className='!m-0 h-4 w-4 !p-0'
            onClick={() => {
              setIsActive(false);
              setResult([]);
            }}
          >
            <X size={18} />
          </Button>
        </div>
      </div>
    );
  }
};

export default DebugFilePill;
