import { db } from '~/lib/db';
import { getFileIcon } from '~/lib/helpers/editor';
import { useEditor } from '~/lib/stores';
import { cn } from '~/lib/utils';

import { Button } from '../ui/button';

import { useLiveQuery } from 'dexie-react-hooks';
import { X } from 'lucide-react';

interface Props {
  path: string;
}

const TabPill = ({ path }: Props) => {
  const { activePath, setActivePath } = useEditor();

  const file = useLiveQuery(async () => {
    const file = await db.files.get(path);
    return file;
  });

  const onRemove = async () => {
    try {
      await db.tabs.delete(path);
      const tabs = await db.tabs.toArray();
      const nextTab = tabs.shift() ?? null;
      setActivePath(nextTab?.path ?? null);
    } catch (error) {
      console.error(error);
    }
  };

  const onSetActiveTab = async () => {
    try {
      setActivePath(path);
    } catch (error) {
      console.log(error);
    }
  };

  if (file)
    return (
      <div
        className={cn(
          'h-[4dvh] min-w-[160px] cursor-pointer border-r flex flex-col',
          activePath === path ? 'bg-blue-500/5' : ''
        )}
      >
        {activePath === path && <div className='w-full h-1 bg-blue-500'></div>}
        <div className='flex flex-row items-center justify-between gap-2 h-full px-2'>
          <div
            className='flex w-full flex-row items-center gap-1'
            onClick={onSetActiveTab}
          >
            <img src={getFileIcon(file.name) ?? ''} className='h-5 w-5'></img>
            <div className='text-base'>{file.name}</div>
          </div>
          <Button
            variant='link'
            className='!m-0 h-4 w-4 !p-0'
            onClick={onRemove}
          >
            <X size={18} />
          </Button>
        </div>
      </div>
    );
};

export default TabPill;
