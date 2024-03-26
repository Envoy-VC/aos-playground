import { db } from '~/lib/db';
import { useToast } from '~/lib/hooks';

import { Button } from '~/components/ui/button';

const ErrorScreen = () => {
  const { toast } = useToast();
  const reset = async () => {
    try {
      await db.delete();
      window.localStorage.clear();
      toast.success('Cache reset successfully');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to reset cache');
    }
  };
  return (
    <div className='flex h-screen w-full items-center justify-center'>
      <div className='flex flex-col items-center gap-2'>
        <img
          src='https://cdni.iconscout.com/illustration/premium/thumb/internal-server-error-500-9836402-8036602.png'
          className='aspect-square w-full max-w-sm'
        />
        <div>
          <h1 className='font-neutral-700 text-xl font-medium'>
            Oops! Something went wrong
          </h1>
        </div>
        <div className='flex flex-row items-center gap-3'>
          <Button onClick={reset}>Reset cache</Button>
          <Button variant='outline' asChild>
            <a href='mailto:vedantchainani1084@gmail.com' target='_blank'>
              Contact Support
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ErrorScreen;
