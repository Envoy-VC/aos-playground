import { SEO } from '~/components';
import CodeSandbox from '~/components/sandbox';
import { Sidebar } from '~/components/sidebar';

const Home = () => {
  return (
    <>
      <SEO
        type='website'
        title='Home Page'
        description='This is the home page'
        ogImage='https://atomic-toolkit-demo.vercel.app/api/og'
      />
      <div className='dark:bg-dark flex h-full max-h-screen w-full flex-row overflow-hidden dark:text-white'>
        <Sidebar />
        <CodeSandbox />
      </div>
    </>
  );
};

export default Home;
