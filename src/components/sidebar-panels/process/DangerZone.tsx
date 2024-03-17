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

import { db } from '~/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

import { toast } from 'sonner';

const DangerZone = () => {
  const processes = useLiveQuery(async () => {
    const processes = await db.processes.toArray();
    return processes;
  }, []);

  const activeProcess = useLiveQuery(async () => {
    const activeProcess = (await db.activeProcess.toArray()).at(0);
    return activeProcess;
  }, [processes]);

  const onClick = async (type: 'all' | 'active') => {
    try {
      if (type === 'active') {
        const process = activeProcess?.id ?? null;
        if (!process) {
          toast.error('Error', {
            description: 'No active process found.',
          });
          return;
        }
        await db.processes.delete(process);
        toast.success('Process Deleted', {
          description: <p className='break-all'>ID: {process}.</p>,
        });
      } else {
        await db.processes.bulkDelete(processes?.map((val) => val.id) ?? []);
      }
      await db.activeProcess.clear();
    } catch (error) {
      toast.error('Error', {
        description: (error as Error).message ?? 'An error occurred',
      });
    }
  };
  return (
    <div className='flex flex-col py-3'>
      <div className='border-b border-neutral-200 py-2 text-lg font-semibold text-neutral-700 dark:border-neutral-700 dark:text-neutral-300'>
        Danger Zone
      </div>
      <div className='flex flex-col gap-2 py-2'>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className='w-full' variant='destructive'>
              Delete Active Process
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will delete the current
                active process from the local database. you can import it again
                by providing the process ID.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={async () => await onClick('active')}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className='w-full' variant='destructive'>
              Delete All Process
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will delete all the processes
                from the local database. you can import them again by providing
                the process ID.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={async () => await onClick('all')}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default DangerZone;
