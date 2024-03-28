import { db } from '~/lib/db';
import { useToast } from '~/lib/hooks';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import { Button } from '~/components/ui/button';

import { TriangleAlert } from 'lucide-react';

const ResetCache = () => {
  const { toast } = useToast();

  const onReset = async () => {
    try {
      await db.delete();
      window.localStorage.clear();
      toast.success({
        title: 'Cache has been cleared successfully.',
        description: 'Refreshing in 3 seconds.',
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      toast.error({
        description: (error as Error).message ?? 'An error occurred',
      });
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='text-base font-semibold'>Danger Zone</div>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className='w-full' variant='destructive'>
            <TriangleAlert size={18} className='mr-2' />
            Reset Cache
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will delete all the processes,
              files, and configurations from the local database. This is not
              reversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onReset}>Confirm</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ResetCache;
