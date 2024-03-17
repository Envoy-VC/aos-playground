import { AOS_ASCII } from '~/lib/helpers/editor';

const DefaultPage = () => {
  return (
    <div className='flex h-full items-center justify-center p-12'>
      <div className='flex flex-col items-center justify-center gap-4'>
        <pre className='select-none text-xs dark:text-neutral-300'>
          {AOS_ASCII}
        </pre>
      </div>
    </div>
  );
};

export default DefaultPage;
