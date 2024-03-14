import React from 'react';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { useForm } from 'react-hook-form';
import { useLocalStorage } from 'usehooks-ts';
import { useActiveAddress } from 'arweave-wallet-kit';

import { spawnProcess } from '~/lib/services/spawn';

const processFormSchema = z.object({
  name: z.string().optional(),
});

export type ProcessForm = z.infer<typeof processFormSchema>;

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/components/ui/drawer';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';

import type { Process } from '~/types';

import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const AddProcess = () => {
  const address = useActiveAddress();

  const [open, setOpen] = React.useState<boolean>(false);
  const [, setProcesses] = useLocalStorage<Process[]>('processes', []);

  const [, setActiveProcess] = useLocalStorage<Process | null>(
    'activeProcess',
    null
  );

  const form = useForm<ProcessForm>({
    resolver: zodResolver(processFormSchema),
  });

  const onSubmit = async (values: ProcessForm) => {
    try {
      if (!address) {
        throw new Error('Connect your wallet to spawn processes');
      }
      const res = await spawnProcess({
        name: values.name,
      });

      setProcesses((prev) => [
        ...prev,
        {
          name: res.name,
          txId: res.id,
          owner: address,
        },
      ]);
      toast.success('Process Spawned', {
        description: <p className='break-all'>ID: {res.id}.</p>,
      });
      setActiveProcess({
        name: res.name,
        txId: res.id,
        owner: address,
      });
      setOpen(false);
    } catch (error) {
      // console.error(error);
      toast.error('Error', {
        description: (error as Error).message ?? 'Something went wrong!',
      });
    }
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger>
        <Button size='icon' className='h-9 w-9'>
          <Plus className='h-5 w-5' />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='mx-auto w-full max-w-sm'>
          <DrawerHeader className='px-2 sm:px-0'>
            <DrawerTitle>Spawn Process</DrawerTitle>
            <DrawerDescription>
              Spawn a new AO Process, assigning the ao Scheduler to schedule its
              messages
            </DrawerDescription>
          </DrawerHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2 '>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder='example name' {...field} />
                    </FormControl>
                    <FormDescription>
                      Display name for the AO Process
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DrawerFooter className='gap-4 px-3 sm:px-0'>
                <Button
                  type='submit'
                  className='!bg-neutral-900 hover:!bg-neutral-900/90 dark:!bg-neutral-50 dark:!text-neutral-900 dark:hover:!bg-neutral-50/90'
                >
                  {form.formState.isSubmitting ? (
                    <Loader2 className='animate-spin' />
                  ) : (
                    'Spawn'
                  )}
                </Button>
                <DrawerClose asChild>
                  <Button variant='outline'>Cancel</Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddProcess;
