import { AOSDark, AOSLight } from '~/assets';

import { cn } from '~/lib/utils';

const PlaygroundLogo = () => {
  return (
    <div className='flex h-[6dvh] items-center border-b border-neutral-200 px-3 dark:border-neutral-700'>
      <img
        src={AOSDark}
        alt='AOS'
        className={cn('hidden h-3 w-auto dark:block')}
      />
      <img
        src={AOSLight}
        alt='AOS'
        className={cn('block h-3 w-auto dark:hidden')}
      />
    </div>
  );
};

export default PlaygroundLogo;
