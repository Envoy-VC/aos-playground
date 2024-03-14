import { Link } from 'react-router-dom';
import { SEO } from '~/components';

import ArLogo from '~/assets/ar-logo.png';

const Contact = () => {
  return (
    <>
      <SEO
        type='website'
        title='Contact Page'
        description='This is the contact page'
        ogImage='https://media.licdn.com/dms/image/D4E12AQEtNc589Tw5aQ/article-cover_image-shrink_720_1280/0/1684337842741?e=1709164800&v=beta&t=D_CXv6KpGhX2OqWzRcHWpOIihh2oUrXoYVXqyUYU_C4'
      />
      <div className='mx-auto flex max-w-screen-2xl flex-col gap-12 p-24 px-4'>
        <div className='flex flex-row items-center gap-4'>
          <img src={ArLogo} className='h-12 w-12' />
          <div className='text-5xl font-bold'>Arweave React Starter</div>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='text-4xl font-bold'>Contact Page</div>
          <Link to={'/'} className='text-blue-500 hover:underline'>
            Go to Home Page
          </Link>
        </div>
      </div>
    </>
  );
};

export default Contact;
