import { AOS_ASCII } from '~/lib/helpers/editor';

import { ContextMenuShortcut } from '~/components/ui/context-menu';

// import { db } from '~/lib/db';
// import { AOSHelp, ProcessList, useCommands } from '~/lib/hooks/useCommands';

// import { useLiveQuery } from 'dexie-react-hooks';

const DefaultPage = () => {
  // const processes = useLiveQuery(() => db.processes.toArray(), []);
  // const { commands } = useCommands();
  return (
    <div className='flex flex-col h-full items-center overflow-scroll p-12'>
      <div className='flex flex-col gap-4 max-w-xl'>
        <pre className='select-none text-xs dark:text-neutral-300'>
          {AOS_ASCII}
        </pre>
        <div className='flex flex-col gap-4'>
          <div className='text-base font-medium text-neutral-700 dark:text-neutral-400 text-center'>
            Welcome to the AOS Web Playground! Web Interface for "ao" Permaweb
            Computer Grid 🐰 🕳️ 👈
          </div>
          <div>
            <ContextMenuShortcut></ContextMenuShortcut>
          </div>
        </div>
      </div>
      {/* <AOSHelp commands={commands} />
      <ProcessList processes={processes ?? []} /> */}
    </div>
  );
};

export default DefaultPage;
