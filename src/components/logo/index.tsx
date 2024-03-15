import { AOSDark, AOSLight } from '~/assets';

import { useSidebar } from '~/lib/stores';
import { cn } from '~/lib/utils';

const PlaygroundLogo = () => {
  const { isOpen } = useSidebar();

  return (
    <div className='flex h-[6dvh] flex-row items-center gap-2 border-b border-neutral-200 px-3 dark:border-neutral-700'>
      <img
        src={AOSDark}
        alt='AOS'
        className={cn('hidden w-auto dark:block', isOpen ? 'h-5' : 'h-3')}
      />
      <img
        src={AOSLight}
        alt='AOS'
        className={cn('block w-auto dark:hidden', isOpen ? 'h-5' : 'h-3')}
      />
      {isOpen && <div className='text-2xl font-medium'>Playground</div>}
    </div>
  );
};

export default PlaygroundLogo;
