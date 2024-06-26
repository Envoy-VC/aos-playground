import { db } from '~/lib/db';
import { getRequireValuesFromAST } from '~/lib/helpers/ast-parser';
import { useToast } from '~/lib/hooks';
import { useDebugFile } from '~/lib/stores';
import { useEditor } from '~/lib/stores';

import { Button } from '~/components/ui/button';
import { Header, HeaderDescription, HeaderTitle } from '~/components/ui/header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import TagForm from './TagForm';

import { useLiveQuery } from 'dexie-react-hooks';
import { Bug } from 'lucide-react';

const RunDebugPanel = () => {
  const { toast } = useToast();
  const { setActivePath } = useEditor();
  const { filePath, setFilePath, setIsActive, setResult } = useDebugFile();

  const files = useLiveQuery(async () => {
    const files = await db.files.toArray();
    return files;
  });

  const onDebug = async () => {
    try {
      if (!filePath) {
        throw new Error('No file selected to debug!');
      }
      const result = await getRequireValuesFromAST(filePath);

      setActivePath(null);
      setResult(result);
      setIsActive(true);
    } catch (error) {
      toast.error({
        description: (error as Error).message ?? 'An error occurred',
      });
    }
  };

  return (
    <div className='flex flex-col gap-4 p-2'>
      <Header>
        <HeaderTitle>Run & Debug</HeaderTitle>
        <HeaderDescription>
          Run and debug your processes, add Data, Tags, and more.
        </HeaderDescription>
      </Header>
      <div className='flex flex-col'>
        <TagForm />
      </div>
      <div className='flex flex-col gap-4'>
        <div className='text-sm font-semibold text-neutral-700 dark:text-neutral-300'>
          Debug Lua Files
        </div>
        <Select value={filePath} onValueChange={setFilePath}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Choose File to Debug' />
          </SelectTrigger>
          <SelectContent>
            {files?.map((file) => (
              <SelectItem
                key={file.path}
                onClick={() => setFilePath(file.path)}
                value={file.path}
              >
                {file.path.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button type='submit' className='w-full gap-2' onClick={onDebug}>
          <Bug size={16} />
          Debug File
        </Button>
      </div>
    </div>
  );
};

export default RunDebugPanel;
