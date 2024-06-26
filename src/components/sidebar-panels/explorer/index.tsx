import React from 'react';

import { db } from '~/lib/db';
import { getFileIcon } from '~/lib/helpers/editor';
import { onCreate } from '~/lib/helpers/editor';
import { useKeyPress, useToast } from '~/lib/hooks';
import { useEditor } from '~/lib/stores';
import { cn } from '~/lib/utils';

import { Button } from '~/components/ui/button';
import { Header, HeaderTitle } from '~/components/ui/header';
import { Input } from '~/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

import FilePill from './FilePill';
import FolderPill from './FolderPill';

import { useLiveQuery } from 'dexie-react-hooks';
import { File, Folder } from 'lucide-react';

const ExplorerPanel = () => {
  const { toast } = useToast();
  const explorerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const {
    isCreating,
    parentFolder,
    name,
    setIsCreating,
    setName,
    setParentFolder,
  } = useEditor();

  const files = useLiveQuery(async () => {
    const files = await db.files.toArray();
    return files;
  }, []);

  const folders = useLiveQuery(async () => {
    const folders = await db.folders.toArray();
    return folders;
  }, []);

  const rootFolders = (folders ?? []).filter(
    (folder) => folder.parentFolder === '/'
  );

  const rootFiles = (files ?? []).filter((file) => file.parentFolder === '/');

  React.useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCreating, inputRef, parentFolder]);

  const handleEnter = async (_e: KeyboardEvent) => {
    try {
      if (isCreating) {
        await onCreate(parentFolder, name, isCreating);
      }
    } catch (error) {
      toast.error({
        description: (error as Error).message,
      });
    } finally {
      setIsCreating(null);
      setName('');
    }
  };

  const handleEscape = (_e: KeyboardEvent) => {
    setIsCreating(null);
    setName('');
  };

  useKeyPress('Enter', handleEnter);
  useKeyPress('Escape', handleEscape);

  const onNewFile = () => {
    setParentFolder('/');
    setIsCreating('file');
  };

  const onNewFolder = () => {
    setParentFolder('/');
    setIsCreating('folder');
  };

  return (
    <div className='flex h-screen w-full flex-col gap-4 py-2' ref={explorerRef}>
      <Header>
        <HeaderTitle className='px-2'>File Explorer</HeaderTitle>
      </Header>
      <div className='flex w-full flex-row items-center justify-between gap-2 border-b px-2 pt-2'>
        <div className='text-sm font-medium uppercase text-neutral-700 dark:text-neutral-200'>
          Playground
        </div>
        <div className='flex flex-row items-center gap-2'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='link'
                  size='icon'
                  className='h-4 w-4'
                  onClick={onNewFile}
                >
                  <File className='h-4 w-4 text-neutral-600 dark:text-neutral-400' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new file</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='link'
                  size='icon'
                  className='h-4 w-4'
                  onClick={onNewFolder}
                >
                  <Folder className='h-4 w-4 text-neutral-600 dark:text-neutral-400' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create a new folder</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className='-translate-y-4'>
        {rootFolders.map((folder) => (
          <FolderPill
            key={folder.path}
            {...folder}
            allFiles={files ?? []}
            allFolders={folders ?? []}
          />
        ))}
        {parentFolder === '/' && (
          <div
            className={cn(
              'flex flex-row items-center gap-2 px-1 ml-1',
              rootFolders.length > 0 && 'ml-6'
            )}
          >
            {isCreating === 'file' && (
              <>
                {getFileIcon(name) ? (
                  <img
                    src={getFileIcon(name) ?? ''}
                    className='h-full w-full max-h-4 max-w-4'
                  />
                ) : (
                  <File className='h-full w-full max-h-4 max-w-4 text-neutral-600 dark:text-neutral-400' />
                )}
              </>
            )}
            {isCreating === 'folder' && (
              <Folder className='h-full w-full max-h-4 max-w-4 text-neutral-600 dark:text-neutral-400' />
            )}
            <Input
              spellCheck={false}
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=''
              className={cn(
                'm-0 h-6 rounded-none border-none p-0 text-sm focus-visible:ring-offset-0',
                !isCreating && 'hidden'
              )}
            />
          </div>
        )}
        <div className={cn(rootFolders.length > 0 && 'px-5')}>
          {rootFiles.map((file) => (
            <FilePill key={file.path} {...file} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExplorerPanel;
