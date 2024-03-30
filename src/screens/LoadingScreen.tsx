import { BarsScale } from 'react-svg-spinners';

import LogoDark from '../../public/logo-dark.png';
import LogoLight from '../../public/logo-light.png';

const LoadingScreen = () => {
  return (
    <div className='font-sans h-screen p-12 flex justify-center w-full '>
      <div className='flex flex-col gap-4 items-center'>
        <img
          src={LogoLight}
          alt='Logo'
          className='w-[20rem] dark:hidden block'
        />
        <img
          src={LogoDark}
          alt='Logo'
          className='w-[20rem] hidden dark:block'
        />
        <BarsScale
          width={48}
          height={48}
          color='var(--editor-foreground)'
          style={{
            color: 'var(--editor-foreground)',
          }}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
