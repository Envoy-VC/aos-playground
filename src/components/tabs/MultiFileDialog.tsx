import { RequireFile } from '~/lib/helpers/ast-parser';
import { Button } from '../ui/button';

import { sendMessage } from '~/lib/services/message';
import { useReadLocalStorage, useLocalStorage } from 'usehooks-ts';

import { toast } from 'sonner';

import { Process } from '~/lib/db';
import { Tag } from '~/types';

import { Play, LoaderCircle } from 'lucide-react';

interface Props {
  data: RequireFile[];
  isSending: boolean;
  setOpen: (value: boolean) => void;
  setIsSending: (value: boolean) => void;
}
const MultiFileDialog = ({ data, isSending, setOpen, setIsSending }: Props) => {
  const activeProcess = useReadLocalStorage<Process | undefined>(
    'activeProcess'
  );

  const [defaultTags] = useLocalStorage<Tag[]>('defaultTags', [
    {
      name: 'Action',
      value: 'Eval',
    },
  ]);

  const resolvedFiles = data.filter((f) => f.exists);
  const unresolvedFiles = data.filter((f) => !f.exists);

  const onRun = async () => {
    try {
      setIsSending(true);
      if (!activeProcess) {
        throw new Error('No active process found');
      }

      // reverse data
      const sequentialFiles = data;
      [...sequentialFiles].reverse();

      for (const file of sequentialFiles) {
        try {
          await sendMessage({
            process: activeProcess.id,
            data: file.content,
            tags: defaultTags,
          });
        } catch (error) {
          console.error('Error processing file:', file.filePath, error);
        }
      }

      toast.success('Messages Sent');
    } catch (error) {
      toast.error('', { description: (error as Error).message });
    } finally {
      setIsSending(false);
      setOpen(false);
    }
  };

  return (
    <div className='text-neutral-700 dark:text-neutral-400'>
      <div className='flex flex-col gap-6 '>
        <div className='text-xl font-medium text-neutral-700 dark:text-neutral-100'>
          Imported files found. They will be sent in order of imports. Do you
          want to proceed?
        </div>

        <div className='flex flex-row justify-between gap-2'>
          <div className='flex flex-col gap-2'>
            <div className='text-lg font-medium dark:text-neutral-300'>
              Resolved Files
            </div>
            <div>
              {resolvedFiles.map((f) => f.filePath.slice(1)).join(', ')}
            </div>
          </div>
        </div>

        {unresolvedFiles.length > 0 && (
          <div className='flex flex-row justify-between gap-2'>
            <div className='flex flex-col gap-2'>
              <div className='text-lg font-medium text-red-500'>
                Unresolved Files
              </div>
              <div>
                {unresolvedFiles.map((f) => f.filePath.slice(1)).join(', ')}
              </div>
            </div>
          </div>
        )}

        <div className='flex w-full items-center justify-end gap-3'>
          <Button
            variant='secondary'
            onClick={() => setOpen(false)}
            disabled={isSending}
          >
            Cancel
          </Button>
          <Button className='gap-2' onClick={onRun} disabled={isSending}>
            {isSending ? (
              <LoaderCircle size={18} className='animate-spin' />
            ) : (
              <Play size={18} />
            )}
            Run
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MultiFileDialog;
