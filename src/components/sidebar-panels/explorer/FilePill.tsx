import React from 'react';

import { db } from '~/lib/db';
import { getFileIcon } from '~/lib/helpers/editor';
import { useKeyPress } from '~/lib/hooks';
import { useEditor } from '~/lib/stores';
import { cn } from '~/lib/utils';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '~/components/ui/context-menu';
import { Input } from '~/components/ui/input';

import { EditorFile } from '~/types';

import { File } from 'lucide-react';
import { useOnClickOutside } from 'usehooks-ts';
import { useCopyToClipboard } from 'usehooks-ts';

const FilePill = ({ name, path, content }: EditorFile) => {
  const fileRef = React.useRef<HTMLDivElement>(null);
  const renameRef = React.useRef<HTMLInputElement>(null);
  const { setActivePath } = useEditor();

  const [, copyToClipboard] = useCopyToClipboard();

  const [newName, setNewName] = React.useState(name);
  const [isRenaming, setIsRenaming] = React.useState(false);
  const [rerender, setRerender] = React.useState(false);

  const onDelete = async () => {
    await db.files.delete(path);
  };

  const onCopyContent = async () => {
    await copyToClipboard(content);
  };

  const onRename = async () => {
    await db.files.update(path, { name: newName });
    setIsRenaming(false);
  };

  const openFile = async () => {
    try {
      const tabs = await db.tabs.toArray();
      const exists = tabs.find((t) => t.path === path) ?? null;
      const file = await db.files.get(path);
      if (!file) return;
      if (!exists) {
        await db.tabs.add(file, path);
      }
      setActivePath(path);
    } catch (error) {
      console.error(error);
    }
  };

  const onEscape = () => {
    setRerender(false);
    setNewName(name);
    setIsRenaming(false);
  };

  useKeyPress('Enter', onRename, { target: fileRef.current });
  useKeyPress('Escape', onEscape, { target: fileRef.current });
  useOnClickOutside(fileRef, onEscape);

  React.useEffect(() => {
    if (isRenaming) {
      setRerender(true);
    }
  }, [isRenaming]);

  React.useEffect(() => {
    if (rerender) {
      renameRef.current?.focus();
    }
  }, [rerender]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          ref={fileRef}
          className={cn(
            'flex cursor-pointer select-none flex-row items-center gap-2 px-2'
          )}
          onClick={openFile}
        >
          {getFileIcon(newName) ? (
            <img src={getFileIcon(newName) ?? ''} className='h-4 w-4' />
          ) : (
            <File className='h-4 w-4 text-neutral-600 dark:text-neutral-400' />
          )}
          {!isRenaming && (
            <span className='text-black dark:text-white'>{name}</span>
          )}
          {isRenaming && (
            <Input
              ref={renameRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder=''
              className={cn(
                'm-0 h-6 rounded-none border-none p-0 text-base focus-visible:ring-offset-0 text-black dark:text-white'
              )}
            />
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className='w-64'>
        <ContextMenuItem inset onClick={openFile}>
          Open to the Side
        </ContextMenuItem>
        <ContextMenuItem
          inset
          onClick={async () => {
            await onCopyContent();
          }}
        >
          Copy
        </ContextMenuItem>

        <ContextMenuSeparator />
        <ContextMenuItem
          inset
          onClick={() => {
            setIsRenaming(true);
          }}
        >
          Rename
        </ContextMenuItem>
        <ContextMenuItem inset onClick={async () => await onDelete()}>
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default FilePill;
