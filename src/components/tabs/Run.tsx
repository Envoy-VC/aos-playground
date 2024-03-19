import React from 'react';

import { Button } from '../ui/button';
import { Play, LoaderCircle } from 'lucide-react';

import { useReadLocalStorage } from 'usehooks-ts';
import { db } from '~/lib/db';

// import { sendMessage } from '~/lib/services/message';

import { parse } from 'luaparse';
import { getRequireValuesFromAST } from '~/lib/helpers/ast-parser';

import { useEditor } from '~/lib/stores';

import { Process } from '~/lib/db';
import { toast } from 'sonner';
import { sendMessage } from '~/lib/services/message';

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
      const ast = parse(data.content);
      console.log(ast);

      console.log(await getRequireValuesFromAST(ast));

      // // const ids = await Promise.all(
      // //   files.reverse().map(async (path) => {
      // //     const fileData = await db.files.get(path);
      // //     if (!fileData) {
      // //       throw new Error('File not found');
      // //     }
      // //     if (fileData.content === '') {
      // //       throw new Error('File is empty');
      // //     }
      // //     const id = await sendMessage({
      // //       process: activeProcess.id,
      // //       data: fileData.content,
      // //     });
      // //     return id;
      // //   })
      // // );

      // // console.log(ids);

      // await sendMessage({
      //   data: data.content,
      //   process: activeProcess.id,
      // });

      toast.success('Messages Sent');
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
