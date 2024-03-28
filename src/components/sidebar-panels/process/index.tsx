import React from 'react';

import { db } from '~/lib/db';
import { useProcess, useToast } from '~/lib/hooks';
import { getProcessById } from '~/lib/services/spawn';

import { Button } from '~/components/ui/button';
import { Header, HeaderDescription, HeaderTitle } from '~/components/ui/header';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import CreateProcess from './CreateProcess';
import DangerZone from './DangerZone';

import { useLiveQuery } from 'dexie-react-hooks';
import { Clipboard, PackageSearch } from 'lucide-react';
import { useCopyToClipboard } from 'usehooks-ts';

const ProcessPanel = () => {
  const { toast } = useToast();
  const { activeProcess, setActiveProcess } = useProcess();
  const [, copyToClipboard] = useCopyToClipboard();

  const processes = useLiveQuery(async () => {
    const processes = await db.processes.toArray();
    return processes;
  }, []);

  const [processId, setProcessId] = React.useState<string>('');
  const [isImporting, setIsImporting] = React.useState<boolean>(false);

  const onValChange = async (id: string) => {
    const process = await db.processes.filter((val) => val.id === id).first();
    if (process) {
      setActiveProcess(process);
      toast.success({
        title: `Process Changed to ${process.name}`,
      });
    } else {
      toast.error({
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
        setActiveProcess(existing);
      } else {
        await db.processes.add(process, process.id);
        setActiveProcess(process);
      }
      toast.success({
        title: 'Process Imported',
        description: <p className='break-all'>ID: {process.id}.</p>,
      });
      setProcessId('');
    } catch (error) {
      toast.error({
        description: (error as Error).message ?? 'An error occurred',
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
            <SelectTrigger>
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
                toast.success({
                  title: 'Process ID Copied',
                });
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
            variant='link'
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
