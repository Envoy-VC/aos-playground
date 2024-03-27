import React from 'react';

import { db } from '~/lib/db';
import { getRequireValuesFromAST } from '~/lib/helpers/ast-parser';
import { useProcess, useTags, useToast } from '~/lib/hooks';
import { sendMessage } from '~/lib/services/message';
import { useEditor } from '~/lib/stores';

import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';

import { RequireFile } from '~/types';

import { Button } from '../ui/button';
import MultiFileDialog from './MultiFileDialog';

import { LoaderCircle, Play } from 'lucide-react';

const Run = () => {
  const { toast } = useToast();
  const { activePath } = useEditor();
  const { activeProcess } = useProcess();
  const { defaultTags: tags } = useTags();
  const [isSending, setIsSending] = React.useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const [requiredFiles, setRequiredFiles] = React.useState<RequireFile[]>([]);

  const checks = async () => {
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
    if (!activePath) {
      throw new Error('No active file found');
    }
    return data;
  };

  const send = async () => {
    try {
      const data = await checks();
      setIsSending(true);

      // TODO: Use web worker to send message
      const requiredFiles = await getRequireValuesFromAST(data.path);

      setRequiredFiles(requiredFiles);

      if (requiredFiles.length === 0) {
        throw new Error('No required files found');
      } else if (requiredFiles.length === 1) {
        sendMessage({
          process: activeProcess!.id,
          data: requiredFiles[0].content,
          tags,
        });
        toast.success({
          title: 'Message sent successfully',
        });
      } else {
        setIsModalOpen(true);
      }
    } catch (error) {
      toast.error({
        description: (error as Error).message,
      });
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
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <MultiFileDialog
            data={requiredFiles}
            setOpen={setIsModalOpen}
            isSending={isSending}
            setIsSending={setIsSending}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Run;
