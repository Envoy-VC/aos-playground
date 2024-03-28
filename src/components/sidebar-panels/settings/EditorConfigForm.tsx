import { useForm } from 'react-hook-form';

import { useEditorConfig, useToast } from '~/lib/hooks';
import { darkThemes, lightThemes } from '~/lib/themes';

import { Button } from '~/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';

import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Save } from 'lucide-react';

const EditorConfigForm = () => {
  const { editorOptions, setEditorConfig } = useEditorConfig();
  const { toast } = useToast();

  const form = useForm<EditorConfigForm>({
    resolver: zodResolver(editorConfigFormSchema),
    defaultValues: editorOptions,
  });

  const onSubmit = (values: EditorConfigForm) => {
    try {
      setEditorConfig(values);
      toast.success({
        description: 'Editor configuration updated',
      });
    } catch (error) {
      toast.error({
        description: (error as Error).message,
      });
    }
  };
  return (
    <div className='flex flex-col gap-4'>
      <div className='text-base font-semibold'>Editor Options</div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          <FormField
            control={form.control}
            name='lightTheme'
            render={({ field }) => (
              <FormItem>
                <div className='text-xs font-semibold text-neutral-700 dark:text-neutral-300'>
                  Light Theme
                </div>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a Light Theme for the Editor' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lightThemes.map((theme) => (
                      <SelectItem key={theme.name} value={theme.name}>
                        {theme.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='darkTheme'
            render={({ field }) => (
              <FormItem>
                <div className='text-xs font-semibold text-neutral-700 dark:text-neutral-300'>
                  Dark Theme
                </div>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Select a Dark Theme for the Editor' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {darkThemes.map((theme) => (
                      <SelectItem key={theme.name} value={theme.name}>
                        {theme.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='fontSize'
            render={({ field: { onChange, ...remaining } }) => (
              <FormItem>
                <div className='text-xs font-semibold text-neutral-700 dark:text-neutral-300'>
                  Font Size
                </div>
                <FormControl>
                  <Input
                    placeholder='Font Size'
                    {...remaining}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    type='number'
                    min={1}
                    max={96}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='w-full'>
            <Save size={16} className='mr-2' />
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export const editorConfigFormSchema = z.object({
  lightTheme: z.string(),
  darkTheme: z.string(),
  fontSize: z.number(),
});

export type EditorConfigForm = z.infer<typeof editorConfigFormSchema>;

export default EditorConfigForm;
