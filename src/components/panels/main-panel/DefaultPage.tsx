import { AOS_ASCII } from '~/lib/helpers/editor';

// import { db } from '~/lib/db';
// import { AOSHelp, ProcessList, useCommands } from '~/lib/hooks/useCommands';

// import { useLiveQuery } from 'dexie-react-hooks';

const DefaultPage = () => {
  // const processes = useLiveQuery(() => db.processes.toArray(), []);
  // const { commands } = useCommands();
  return (
    <div className='flex flex-col h-full items-center justify-center overflow-scroll p-12'>
      <div className='flex flex-col items-center justify-center gap-4'>
        <pre className='select-none text-xs dark:text-neutral-300'>
          {AOS_ASCII}
        </pre>
      </div>
      {/* <AOSHelp commands={commands} />
      <ProcessList processes={processes ?? []} /> */}
    </div>
  );
};

export default DefaultPage;
