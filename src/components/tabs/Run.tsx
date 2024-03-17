import React from 'react';

import { Button } from '../ui/button';
import { Play, LoaderCircle } from 'lucide-react';

import { useReadLocalStorage } from 'usehooks-ts';
import { db } from '~/lib/db';
import { sendMessage } from '~/lib/services/message';

import { useEditor } from '~/lib/stores';

import { Process } from '~/lib/db';
import { toast } from 'sonner';

const Run = () => {
  const { activePath } = useEditor();
  const [isSending, setIsSending] = React.useState<boolean>(false);

  const activeProcess = useReadLocalStorage<Process | undefined>(
    'activeProcess'
  );

  const send = async () => {
    try {
      if (!activeProcess) {
        throw new Error('No active process found');
      }
      const data = await db.files.get(activePath ?? '');
      if (!data) {
        throw new Error('File not found');
      }
      if (data.content === '') {
        throw new Error('File is empty');
      }
      setIsSending(true);
      await sendMessage({
        data: data.content,
        process: activeProcess.id,
      });
      toast.success('Message sent');
    } catch (error) {
      toast.error('', { description: (error as Error).message });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <Button
        size='sm'
        variant='ghost'
        className='gap-2'
        onClick={send}
        disabled={isSending}
      >
        {isSending ? (
          <LoaderCircle size={18} className='animate-spin' />
        ) : (
          <Play size={18} />
        )}
        Run
      </Button>
    </div>
  );
};

export default Run;
