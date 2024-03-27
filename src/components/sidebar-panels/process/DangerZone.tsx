import { db } from '~/lib/db';
import { useProcess, useToast } from '~/lib/hooks';

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

import { useLiveQuery } from 'dexie-react-hooks';
import { TriangleAlert } from 'lucide-react';

const DangerZone = () => {
  const { toast } = useToast();
  const { activeProcess, setActiveProcess } = useProcess();

  const processes = useLiveQuery(async () => {
    const processes = await db.processes.toArray();
    return processes;
  }, []);

  const onClick = async (type: 'all' | 'active') => {
    try {
      if (type === 'active') {
        const process = activeProcess?.id ?? null;
        if (!process) {
          toast.error({
            description: 'No active process found.',
          });
          return;
        }
        await db.processes.delete(process);
        toast.success({
          title: 'Process Deleted',
          description: <p className='break-all'>ID: {process}.</p>,
        });
      } else {
        await db.processes.bulkDelete(processes?.map((val) => val.id) ?? []);
      }
      setActiveProcess(undefined);
    } catch (error) {
      toast.error({
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
              <TriangleAlert size={18} className='mr-2' />
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
              <TriangleAlert size={18} className='mr-2' />
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
