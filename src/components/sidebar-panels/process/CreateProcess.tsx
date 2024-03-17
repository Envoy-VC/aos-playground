import React from 'react';

import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';

import { useActiveAddress } from 'arweave-wallet-kit';
import { useLocalStorage } from 'usehooks-ts';

import { spawnProcess } from '~/lib/services/spawn';

import { db, Process } from '~/lib/db';

import { PackagePlus, ChevronRight } from 'lucide-react';
import { cn } from '~/lib/utils';
import { toast } from 'sonner';

const CreateProcess = () => {
  const [showAdvanced, setShowAdvanced] = React.useState<boolean>(false);
  const address = useActiveAddress();

  const form = useForm<CreateProcessType>({
    resolver: zodResolver(createProcessSchema),
  });

  const [, setActiveProcess] = useLocalStorage<Process | undefined>(
    'activeProcess',
    undefined
  );

  const onSubmit = async (values: CreateProcessType) => {
    try {
      if (!address) {
        throw new Error('Connect your wallet to spawn processes');
      }
      const res = await spawnProcess({ ...values, owner: address });

      db.processes.add(res, res.id);
      setActiveProcess(res);

      toast.success('Process Spawned', {
        description: <p className='break-all'>ID: {res.id}.</p>,
      });
      form.reset();
    } catch (error) {
      toast.error('Error', {
        description: (error as Error).message ?? 'Something went wrong!',
      });
    }
  };

  return (
    <div className='flex flex-col justify-start'>
      <div className='text-xs font-semibold text-neutral-700 dark:text-neutral-300'>
        Create Process
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col justify-start'
        >
          <div className='flex w-full flex-row justify-start gap-2'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='w-full'>
                  <FormControl>
                    <Input
                      disabled={form.formState.isSubmitting}
                      placeholder='Process Name (optional)'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type='submit'
              disabled={form.formState.isSubmitting}
              size='icon'
              className='h-9 w-full max-w-9'
              variant='secondary'
            >
              <PackagePlus className='h-5 w-5 text-neutral-700 dark:text-neutral-100' />
            </Button>
          </div>
          <div>
            <Button
              type='button'
              className='m-0 h-4 p-0'
              variant='link'
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <ChevronRight
                size={18}
                className={cn(
                  'transition-all duration-200 ease-out',
                  showAdvanced ? 'rotate-90 transform' : 'rotate-0 transform'
                )}
              />
              <div className='text-xs font-medium'>Advanced Options</div>
            </Button>
            {showAdvanced && (
              <div className=''>
                <FormField
                  control={form.control}
                  name='module'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Module</FormLabel>
                      <FormControl>
                        <Input
                          disabled={form.formState.isSubmitting}
                          placeholder='Module (optional)'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name='scheduler'
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormLabel>Scheduler</FormLabel>
                      <FormControl>
                        <Input
                          disabled={form.formState.isSubmitting}
                          placeholder='Scheduler (optional)'
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

const createProcessSchema = z.object({
  name: z.string().optional(),
  module: z.string().optional(),
  scheduler: z.string().optional(),
});

export type CreateProcessType = z.infer<typeof createProcessSchema>;

export default CreateProcess;
