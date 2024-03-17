import React from 'react';

import { Header, HeaderTitle } from '~/components/ui/header';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip';

import FolderPill from './FolderPill';
import FilePill from './FilePill';

import { useEditor } from '~/lib/stores';

import { File, Folder } from 'lucide-react';
import { db } from '~/lib/db';

import { getFileIcon } from '~/lib/helpers/editor';
import { useLiveQuery } from 'dexie-react-hooks';
import { cn } from '~/lib/utils';

import { onCreate } from '~/lib/helpers/editor';
import SidePanelContextMenu from './ContextMenu';

const ExplorerPanel = () => {
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

  React.useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (isCreating) {
          onCreate(parentFolder, name, isCreating);
          setIsCreating(null);
          setName('');
        }
      } else if (e.key === 'Escape') {
        setIsCreating(null);
        setName('');
      }
    };
    window.addEventListener('keydown', handleEnter);
    return () => window.removeEventListener('keydown', handleEnter);
  }, [name, isCreating]);

  return (
    <div className='flex h-screen w-full flex-col gap-4 py-2'>
      <Header>
        <HeaderTitle className='px-2'>File Explorer</HeaderTitle>
      </Header>
      <div className='flex w-full flex-row items-center justify-between gap-2 border-b border-neutral-200 px-2 pt-2 dark:border-neutral-600'>
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
                  onClick={() => {
                    setParentFolder('/');
                    setIsCreating('file');
                  }}
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
                  onClick={() => {
                    setParentFolder('/');
                    setIsCreating('folder');
                  }}
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
        {rootFiles.map((file) => (
          <FilePill key={file.path} {...file} />
        ))}
        {parentFolder === '/' && (
          <div className='ml-[1.5rem] flex flex-row items-center gap-2 px-1 '>
            {isCreating === 'file' && (
              <>
                {getFileIcon(name) ? (
                  <img src={getFileIcon(name) ?? ''} className='h-4 w-4' />
                ) : (
                  <File className='h-4 w-4 text-neutral-600 dark:text-neutral-400' />
                )}
              </>
            )}
            {isCreating === 'folder' && (
              <Folder className='h-4 w-4 text-neutral-600 dark:text-neutral-400' />
            )}
            <Input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=''
              className={cn(
                'm-0 h-6 rounded-none border-none p-0 text-sm focus-visible:ring-offset-0',
                isCreating ? 'opacity-100' : 'hidden'
              )}
            />
          </div>
        )}
      </div>
      <SidePanelContextMenu>
        <div className='min-h-max w-full'></div>
      </SidePanelContextMenu>
    </div>
  );
};

export default ExplorerPanel;
