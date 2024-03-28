import { AOS_ASCII } from '~/lib/helpers/editor';

import { ContextMenuShortcut } from '~/components/ui/context-menu';

const DefaultPage = () => {
  return (
    <div className='flex flex-col h-full items-center overflow-scroll p-12'>
      <div className='flex flex-col gap-4 max-w-2xl w-full'>
        <pre className='select-none text-xs dark:text-neutral-300 text-center'>
          {AOS_ASCII}
        </pre>
        <div className='flex flex-col gap-4 text-neutral-700 dark:text-neutral-400'>
          <div className='text-base font-medium text-center'>
            Welcome to the AOS Web Playground! Web Interface for "ao" Permaweb
            Computer Grid 🐰 🕳️ 👈
          </div>
          <div className='py-3 font-semibold'>Commands</div>
          <div className='flex flex-row items-center w-full'>
            <div className='space-y-1 w-full'>
              <CommandBox name='Toggle Terminal' command='⌃ + `' />
              <CommandBox name='Clear Terminal' command='clear' />
              <CommandBox name='Help' command='aos help' />
              <CommandBox name='List Processes' command='aos list' />
            </div>

            <div className='space-y-1 w-full'>
              <CommandBox name='New Line' command='⇧ + Enter' />
              <CommandBox name='Run File' command='aos load <path>' />
              <CommandBox name='Format File' command='⌘ + S' />
              <CommandBox name='Set Active' command='aos set-active <pid>' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface CommandBoxProps {
  name: string;
  command: string;
}
export const CommandBox = ({ name, command }: CommandBoxProps) => {
  return (
    <div className='font-medium flex flex-row items-center gap-4 max-w-[18rem] justify-between'>
      {name}
      <ContextMenuShortcut className='px-1 text-base rounded-sm bg-neutral-100 font-normal dark:bg-black/15'>
        {command}
      </ContextMenuShortcut>
    </div>
  );
};

export default DefaultPage;
