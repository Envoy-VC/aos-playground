import React from 'react';

import { useEditorConfig } from '~/lib/hooks';
import { useDebugFile } from '~/lib/stores';

import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';

import { codeToHtml } from 'shiki';
import { RequireFile } from '~/types';

import FileModal from './FileModal';

import { Maximize2 } from 'lucide-react';

const DebugPanel = () => {
  const { result } = useDebugFile();
  const [activeResult, setActiveResult] = React.useState<RequireFile | null>(
    null
  );

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const resolvedFiles = result.filter((f) => f.exists);
  const unresolvedFiles = result.filter((f) => !f.exists);

  return (
    <div className='flex h-full flex-col overflow-scroll  p-6'>
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

      <div className='flex flex-col gap-4 py-4'>
        {resolvedFiles.map((res) => {
          return (
            <div className='flex flex-col gap-1 px-4 max-w-3xl'>
              <div className='flex flex-row gap-2 items-center justify-between font-medium text-neutral-700 dark:text-neutral-300'>
                <span>
                  File: <span>{res.filePath.slice(1)}</span>
                </span>
                <Button
                  size='icon'
                  variant='link'
                  onClick={() => {
                    setActiveResult(res);
                    setIsOpen(true);
                  }}
                >
                  <Maximize2 size={16} />
                </Button>
              </div>
              <ScrollArea className='h-[16rem] w-full rounded-sm border border-neutral-200 p-1 dark:border-neutral-700'>
                <RenderJSON code={JSON.stringify(res.ast, null, 2)} />
              </ScrollArea>
            </div>
          );
        })}
      </div>
      <FileModal onOpenChange={setIsOpen} isOpen={isOpen} file={activeResult} />
    </div>
  );
};

export const RenderJSON = ({ code }: { code: string }) => {
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
    <div
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
};

export default DebugPanel;
