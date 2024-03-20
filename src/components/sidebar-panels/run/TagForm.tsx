import React from 'react';
import { useLocalStorage } from 'usehooks-ts';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';

import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';

import { Trash, Plus, Save } from 'lucide-react';

import { Tag } from '~/types';
import { toast } from 'sonner';

const TagForm = () => {
  const [defaultTags, setDefaultTags] = useLocalStorage<Tag[]>('defaultTags', [
    {
      name: 'Action',
      value: 'Eval',
    },
  ]);

  const form = useForm<TagsForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tags: defaultTags,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'tags',
  });

  const onAddTag = () => {
    append({
      name: '',
      value: '',
    });
  };

  const onRemoveTag = (index: number) => {
    remove(index);
  };

  const onSubmit = async (values: TagsForm) => {
    const tags = values.tags;
    const names = tags.map((tag) => tag.name);
    const duplicate = names.find(
      (name, index) => names.indexOf(name) !== index
    );

    if (duplicate) {
      toast.error(`Duplicate Tag Name: ${duplicate}`);
      return;
    }

    setDefaultTags(tags);

    toast.success('Tags added successfully');
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <div className='text-sm font-semibold text-neutral-700 dark:text-neutral-300'>
          Data Tags
        </div>
        <Button
          type='button'
          variant='ghost'
          onClick={onAddTag}
          className='h-10 w-10'
          size='icon'
        >
          <Plus size={16} />
        </Button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
          {fields.map((_item, index) => (
            <React.Fragment key={index}>
              <div className='flex flex-row items-center gap-1'>
                <FormField
                  control={form.control}
                  name={`tags.${index}.name`}
                  render={({ field }) => (
                    <FormItem className='my-0'>
                      <FormControl>
                        <Input
                          placeholder={`Name`}
                          {...field}
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`tags.${index}.value`}
                  render={({ field }) => (
                    <FormItem className='w-full'>
                      <FormControl>
                        <Input
                          placeholder={`value`}
                          className='w-full'
                          {...field}
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type='button'
                  size='icon'
                  variant='secondary'
                  className='!h-10 min-w-10'
                  onClick={() => onRemoveTag(index)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </React.Fragment>
          ))}

          <Button type='submit' className='w-full gap-2'>
            <Save size={16} />
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

const tagSchema = z.object({
  name: z.string(),
  value: z.string(),
});

export const formSchema = z.object({
  tags: z.array(tagSchema),
});

export type TagsForm = z.infer<typeof formSchema>;

export default TagForm;
