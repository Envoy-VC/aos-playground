import { Link } from 'react-router-dom';

import { cn } from '~/lib/utils';

import { AOSDark, AOSLight } from '~/assets';

const PlaygroundLogo = () => {
  return (
    <Link className='flex h-[6dvh] items-center border-b px-3' to='/'>
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
    </Link>
  );
};

export default PlaygroundLogo;
