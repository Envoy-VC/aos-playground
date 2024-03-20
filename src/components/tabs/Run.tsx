import React from 'react';

import { Button } from '../ui/button';
import { Play, LoaderCircle } from 'lucide-react';

import { useReadLocalStorage } from 'usehooks-ts';
import { db } from '~/lib/db';

import { parse } from 'luaparse';
import { getRequireValuesFromAST, RequireFile } from '~/lib/helpers/ast-parser';

import { useEditor } from '~/lib/stores';

import { Process } from '~/lib/db';
import { toast } from 'sonner';
import { sendMessage } from '~/lib/services/message';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import MultiFileDialog from './MultiFileDialog';

const Run = () => {
  const { activePath } = useEditor();
  const [isSending, setIsSending] = React.useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);

  const activeProcess = useReadLocalStorage<Process | undefined>(
    'activeProcess'
  );

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
      const ast = parse(data.content);
      const requiredFiles = await getRequireValuesFromAST(ast);
      requiredFiles.push({
        filePath: activePath!,
        content: data.content,
        exists: true,
      });
      setRequiredFiles(requiredFiles);

      if (requiredFiles.length === 0) {
        throw new Error('No required files found');
      } else if (requiredFiles.length === 1) {
        sendMessage({
          process: activeProcess!.id,
          data: requiredFiles[0].content,
        });
        toast.success('Messages Sent');
      } else {
        setIsModalOpen(true);
      }
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
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger></DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
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
