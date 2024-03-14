import React from 'react';

import { useLocalStorage, useIsMounted } from 'usehooks-ts';

import { toast } from 'sonner';
import { useEditor } from '~/lib/stores/editor';

type WorkerModule = typeof import('./worker');

import AddProcess from './AddProcess';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

import { getProcessById } from '~/lib/services/spawn';

import type { Process } from '~/types';

import { PackagePlus } from 'lucide-react';

const ProcessSpawner = () => {
  const { code } = useEditor();

  const [processes, setProcesses] = useLocalStorage<Process[]>('processes', []);

  const [activeProcess, setActiveProcess] = useLocalStorage<Process | null>(
    'activeProcess',
    null
  );

  const [processId, setProcessId] = React.useState<string>('');

  const isMounted = useIsMounted();

  const api = new ComlinkSharedWorker<WorkerModule>(
    new URL('./worker', import.meta.url)
  );

  const onValChange = (txId: string) => {
    const process = processes.find((p) => p.txId === txId);
    if (process) {
      setActiveProcess(process);
      toast.success(`Process Changed to ${process.name}`, {
        description: <p className='break-all'>ID: {process.txId}.</p>,
      });
    } else {
      toast.error('Error', {
        description: 'Process not found in local storage.',
      });
    }
  };

  const onImportProcess = async () => {
    try {
      if (processId === '') {
        throw new Error('Process ID is required');
      }
      const process = await getProcessById(processId);

      const existing = processes.find((val) => val.txId === process.txId);

      if (existing) {
        setActiveProcess(existing);
      } else {
        setProcesses((prev) => [...prev, process]);
        setActiveProcess(process);
      }
      toast.success('Process Imported', {
        description: <p className='break-all'>ID: {process.txId}.</p>,
      });
      setProcessId('');
    } catch (error) {
      toast.error('Error', {
        description: (error as Error).message ?? 'Something went wrong!',
      });
    }
  };

  if (!isMounted()) {
    return null;
  }

  return (
    <div className='m-4 flex flex-row items-center gap-2'>
      <Select
        value={activeProcess ? activeProcess.txId : undefined}
        onValueChange={(txId) => onValChange(txId)}
      >
        <SelectTrigger className='w-[300px] !bg-white dark:!bg-transparent'>
          <SelectValue placeholder='Select Process' />
        </SelectTrigger>
        <SelectContent className='p-2'>
          <SelectGroup>
            <div className=' flex flex-col gap-2'>
              <div className='text-sm font-semibold'>Import Process</div>
              <div className='flex flex-row items-center gap-2'>
                <Input
                  placeholder='Process ID'
                  value={processId ?? ''}
                  onChange={(e) => setProcessId(e.target.value)}
                />
                <Button
                  size='icon'
                  className='h-9 w-full max-w-9'
                  onClick={onImportProcess}
                  variant='secondary'
                >
                  <PackagePlus className='h-5 w-5 text-neutral-700 dark:text-neutral-100' />
                </Button>
              </div>
            </div>
          </SelectGroup>
          <SelectGroup className='pt-4'>
            <div className='my-3 text-sm font-semibold'>Local Storage</div>
            {processes.map((process) => (
              <SelectItem key={process.txId} value={process.txId}>
                <span className=''>
                  {process.name}{' '}
                  <span className='text-xs font-bold'>
                    {`(${process.txId.slice(0, 3)}...${process.txId.slice(-3)})`}
                  </span>
                </span>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <AddProcess />
      <Button
        onClick={async () => {
          const res = await api.run(code);
          console.log(res);
        }}
      >
        Run
      </Button>
    </div>
  );
};

export default ProcessSpawner;
