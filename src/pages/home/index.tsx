import { SEO } from '~/components';
import CodeSandbox from '~/components/sandbox';

const Home = () => {
  return (
    <>
      <SEO
        type='website'
        title='Home Page'
        description='This is the home page'
        ogImage='https://atomic-toolkit-demo.vercel.app/api/og'
      />
      <div className=''>
        <CodeSandbox />
      </div>
    </>
  );
};

export default Home;
