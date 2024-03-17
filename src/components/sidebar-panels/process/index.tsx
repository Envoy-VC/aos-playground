import React from 'react';

import { Header, HeaderTitle, HeaderDescription } from '~/components/ui/header';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';

import { useCopyToClipboard } from 'usehooks-ts';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '~/lib/db';

import { toast } from 'sonner';
import { PackageSearch, Clipboard } from 'lucide-react';

import { getProcessById } from '~/lib/services/spawn';

import CreateProcess from './CreateProcess';
import DangerZone from './DangerZone';

const ProcessPanel = () => {
  const processes = useLiveQuery(async () => {
    const processes = await db.processes.toArray();
    return processes;
  }, []);

  const activeProcess = useLiveQuery(async () => {
    const activeProcess = (await db.activeProcess.toArray()).at(0);
    return activeProcess;
  }, [processes]);

  const [, copyToClipboard] = useCopyToClipboard();

  const [processId, setProcessId] = React.useState<string>('');
  const [isImporting, setIsImporting] = React.useState<boolean>(false);

  const onValChange = async (id: string) => {
    const process = await db.processes.filter((val) => val.id === id).first();
    if (process) {
      await db.activeProcess.clear();
      await db.activeProcess.add(process, process.id);
      toast.success(`Process Changed to ${process.name}`);
    } else {
      toast.error('Error', {
        description: 'Process not found in local storage.',
      });
    }
  };

  const onImportProcess = async () => {
    try {
      setIsImporting(true);
      if (processId === '') {
        throw new Error('Process ID is required');
      }
      const process = await getProcessById(processId);

      const existing = (processes ?? []).find((val) => val.id === process.id);

      if (existing) {
        await db.activeProcess.clear();
        await db.activeProcess.add(existing, process.id);
      } else {
        await db.processes.add(process, process.id);
        await db.activeProcess.clear();
        await db.activeProcess.add(process, process.id);
      }
      toast.success('Process Imported', {
        description: <p className='break-all'>ID: {process.id}.</p>,
      });
      setProcessId('');
    } catch (error) {
      toast.error('Error', {
        description: (error as Error).message ?? 'Something went wrong!',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className='flex flex-col gap-4 p-2'>
      <Header>
        <HeaderTitle>Processes</HeaderTitle>
        <HeaderDescription>View and manage running processes</HeaderDescription>
      </Header>
      <div className='flex flex-col'>
        <div className='text-xs font-semibold text-neutral-700 dark:text-neutral-300'>
          Active Process
        </div>
        <div className='flex flex-row items-center gap-2'>
          <Select
            value={activeProcess ? activeProcess.id : undefined}
            onValueChange={(txId) => onValChange(txId)}
          >
            <SelectTrigger className='w-[300px] !bg-white dark:!bg-transparent'>
              <SelectValue placeholder='Select Process' />
            </SelectTrigger>
            <SelectContent className=''>
              {(processes ?? []).map((process) => (
                <SelectItem key={process.id} value={process.id} className=''>
                  <span>
                    {process.name}{' '}
                    <span className='text-xs font-bold'>
                      {`(${process.id.slice(0, 2)}...${process.id.slice(-2)})`}
                    </span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size='icon'
            disabled={!activeProcess}
            onClick={() => {
              if (activeProcess) {
                copyToClipboard(activeProcess.id);
              }
            }}
            className='h-9 w-full max-w-9'
            variant='link'
          >
            <Clipboard className='h-5 w-5 text-neutral-700 dark:text-neutral-100' />
          </Button>
        </div>
      </div>
      <div className='flex flex-col'>
        <div className='text-xs font-semibold text-neutral-700 dark:text-neutral-300'>
          Import Process
        </div>
        <div className='flex flex-row items-center gap-2'>
          <Input
            disabled={isImporting}
            placeholder='Process ID'
            value={processId ?? ''}
            onChange={(e) => setProcessId(e.target.value)}
          />
          <Button
            size='icon'
            disabled={isImporting}
            className='h-9 w-full max-w-9'
            onClick={onImportProcess}
            variant='secondary'
          >
            <PackageSearch className='h-5 w-5 text-neutral-700 dark:text-neutral-100' />
          </Button>
        </div>
      </div>
      <CreateProcess />
      <DangerZone />
    </div>
  );
};

export default ProcessPanel;
