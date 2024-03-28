import React from 'react';

import { useEditorConfig } from '~/lib/hooks';
import { useDebugFile } from '~/lib/stores';

import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';

import { codeToHtml } from 'shiki';

import { X } from 'lucide-react';

const DebugPanel = () => {
  const { result, setIsActive, setResult } = useDebugFile();

  const onClose = () => {
    setIsActive(false);
    setResult([]);
  };

  const resolvedFiles = result.filter((f) => f.exists);
  const unresolvedFiles = result.filter((f) => !f.exists);

  return (
    <div className='flex h-full flex-col overflow-scroll'>
      <div className='flex items-center justify-between px-4 py-2'>
        <div className='text-lg font-semibold text-neutral-700 dark:text-neutral-300'>
          Debug Panel
        </div>
        <Button
          className='w=10 h-10'
          variant='link'
          size='icon'
          onClick={onClose}
        >
          <X size={22} />
        </Button>
      </div>

      <div className='flex flex-row justify-between gap-2 px-4'>
        <div className='flex flex-row gap-2'>
          <div className='text-base font-medium dark:text-neutral-300'>
            Resolved Files:
          </div>
          <div className='text-base font-normal text-neutral-700 dark:text-neutral-300'>
            {resolvedFiles.map((f) => f.filePath.slice(1)).join(', ')}
          </div>
        </div>
      </div>

      {unresolvedFiles.length > 0 && (
        <div className='flex flex-row justify-between gap-2 px-4'>
          <div className='flex flex-row gap-2'>
            <div className='text-base font-medium dark:text-neutral-300'>
              Unresolved Files:
            </div>
            <div className='text-base font-normal text-neutral-700 dark:text-neutral-300'>
              {unresolvedFiles.map((f) => f.filePath.slice(1)).join(', ')}
            </div>
          </div>
        </div>
      )}

      <div className='flex flex-col gap-4 p-2'>
        {resolvedFiles.map((res) => {
          return (
            <div className='flex flex-col gap-1 px-4'>
              <div className='text-sm font-semibold text-neutral-700 dark:text-neutral-300'>
                File:{' '}
                <span className='font-semibold'>{res.filePath.slice(1)}</span>
              </div>
              <RenderJSON code={JSON.stringify(res.ast, null, 2)} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RenderJSON = ({ code }: { code: string }) => {
  const { editorOptions } = useEditorConfig();
  const [html, setHTML] = React.useState<string>('');

  React.useEffect(() => {
    const run = async () => {
      const html = await codeToHtml(code, {
        lang: 'json',
        themes: {
          light: editorOptions.lightTheme,
          dark: editorOptions.darkTheme,
        },
      });
      setHTML(html);
    };
    void run();
  }, [code, editorOptions]);

  return (
    <ScrollArea className='h-[16rem] w-full max-w-3xl rounded-xl border border-neutral-200 p-1 dark:border-neutral-700'>
      <div
        dangerouslySetInnerHTML={{
          __html: html,
        }}
      />
    </ScrollArea>
  );
};

export default DebugPanel;
