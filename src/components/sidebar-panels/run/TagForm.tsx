import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

import { useTags, useToast } from '~/lib/hooks';

import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Plus, Save, Trash } from 'lucide-react';

const TagForm = () => {
  const { toast } = useToast();
  const { defaultTags, setDefaultTags } = useTags();

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
      toast.error({
        description: `Duplicate tag name: ${duplicate}`,
      });
      return;
    }

    setDefaultTags(tags);

    toast.success({
      description: 'Tags saved successfully',
    });
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
                  variant='outline'
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
