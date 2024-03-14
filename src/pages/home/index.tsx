import { Link } from 'react-router-dom';

import { SEO } from '~/components';

import ArLogo from '~/assets/ar-logo.png';

const Home = () => {
  return (
    <>
      <SEO
        type='website'
        title='Home Page'
        description='This is the home page'
        ogImage='https://atomic-toolkit-demo.vercel.app/api/og'
      />
      <div className='mx-auto flex max-w-screen-2xl flex-col gap-12 p-24 px-4'>
        <div className='flex flex-row items-center gap-4'>
          <img src={ArLogo} className='h-12 w-12' />
          <div className='text-5xl font-bold'>Arweave React Starter</div>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='text-4xl font-bold'>Home Page</div>
          <Link to={'/contact'} className='text-blue-500 hover:underline'>
            Go to Contacts Page -&gt;
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
