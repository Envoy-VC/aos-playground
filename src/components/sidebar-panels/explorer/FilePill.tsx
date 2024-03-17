import React from 'react';

import { EditorFile } from '~/lib/db';
import { getFileIcon } from '~/lib/helpers/editor';
import { File } from 'lucide-react';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '~/components/ui/context-menu';
import { Input } from '~/components/ui/input';

import { db } from '~/lib/db';
import { cn } from '~/lib/utils';
import { useCopyToClipboard } from 'usehooks-ts';
import { useEditor } from '~/lib/stores';

const FilePill = ({ name, path, content, parentFolder }: EditorFile) => {
  const renameRef = React.useRef<HTMLInputElement>(null);
  const { setActivePath } = useEditor();

  const [, copyToClipboard] = useCopyToClipboard();

  const [newName, setNewName] = React.useState(name);
  const [isRenaming, setIsRenaming] = React.useState(false);

  const onDelete = async () => {
    await db.files.delete(path);
  };

  const onCopyContent = async () => {
    await copyToClipboard(content);
  };

  const onRename = async () => {
    await db.files.update(path, { name: newName });
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

  React.useEffect(() => {
    if (isRenaming) {
      const handleRename = (e: KeyboardEvent) => {
        if (e.key === 'Enter') {
          onRename();
          setIsRenaming(false);
        } else if (e.key === 'Escape') {
          setNewName(name);
          setIsRenaming(false);
        }
      };
      window.addEventListener('keydown', handleRename);
      return () => {
        window.removeEventListener('keydown', handleRename);
      };
    }
  }, [isRenaming, newName]);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            'flex cursor-pointer select-none flex-row items-center gap-2 px-7',
            isRenaming
              ? 'border border-neutral-300 dark:border-neutral-600'
              : ''
          )}
          onClick={openFile}
        >
          {getFileIcon(newName) ? (
            <img src={getFileIcon(newName) ?? ''} className='h-4 w-4' />
          ) : (
            <File className='h-4 w-4 text-neutral-600 dark:text-neutral-400' />
          )}
          {!isRenaming && <span>{name}</span>}
          {isRenaming && (
            <Input
              ref={renameRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder=''
              className={cn(
                'm-0 h-6 rounded-none border-none p-0 text-base focus-visible:ring-offset-0'
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
