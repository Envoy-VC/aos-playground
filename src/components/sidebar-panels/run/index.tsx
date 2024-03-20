import { Header, HeaderTitle, HeaderDescription } from '~/components/ui/header';
import TagForm from './TagForm';
import { parse } from 'luaparse';
import { getRequireValuesFromAST } from '~/lib/helpers/ast-parser';

import { Button } from '~/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import { useLiveQuery } from 'dexie-react-hooks';

import { Bug } from 'lucide-react';
import { db } from '~/lib/db';

import { useDebugFile } from '~/lib/stores';

const RunDebugPanel = () => {
  const files = useLiveQuery(async () => {
    const files = await db.files.toArray();
    return files;
  });

  const { filePath, setFilePath, setIsActive, setResult } = useDebugFile();

  const onDebug = async () => {
    try {
      if (!filePath) return;
      const content = (await db.files.get(filePath))?.content ?? '';
      const ast = parse(content);
      console.log(ast);

      const result = await getRequireValuesFromAST(ast);
      result.push({
        filePath,
        ast,
        content,
        exists: true,
      });
      setResult(result);
      setIsActive(true);
    } catch (error) {
      console.error(error);
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
