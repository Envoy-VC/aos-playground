import { db } from '~/lib/db';
import { safeRenderToString } from '~/lib/helpers/rehype';

import { useLocalStorage } from 'usehooks-ts';

import { TerminalCommand } from '~/types/terminal';

export const useCommands = () => {
  const [, setLastCursor] = useLocalStorage<number>('lastCursor', 0);

  const commands: TerminalCommand[] = [
    {
      name: 'aos help',
      params: [],
      flags: [],
      description: 'Print help information about the AOS Terminal',
      usage: 'aos help',
      handler: (_args: string[]) =>
        printToConsole(<AOSHelp commands={commands} />),
    },
    {
      name: 'clear',
      params: [],
      flags: [],
      description: 'Clear the AOS Terminal',
      usage: 'clear',
      handler: async (_args: string[]) => {
        const last = await db.results.count();
        setLastCursor(last);
      },
    },
  ];

  return { commands };
};

const printToConsole = async (Element: JSX.Element) => {
  const string = safeRenderToString(Element);
  await db.results.put({
    type: 'command',
    cursor: crypto.randomUUID(),
    command: string,
    process: 'output',
  });
};

export const AOSHelp = ({ commands }: { commands: TerminalCommand[] }) => {
  return (
    <div className='flex flex-col font-sans gap-4 max-w-3xl select-none'>
      <div className='text-xl font-medium'>
        Welcome to AOS Terminal!
        <br />
        <div className='text-sm text-neutral-600 dark:text-neutral-300'>
          Here are some commands to get you started.
        </div>
      </div>
      <table className='table-auto w-full'>
        <thead>
          <tr className=' border'>
            <th className='px-4 py-2 font-medium text-sm '>Name</th>
            <th className='px-4 py-2 font-medium text-sm '>Parameters</th>
            <th className='px-4 py-2 font-medium text-sm '>Flags</th>
            <th className='px-4 py-2 font-medium text-sm '>Description</th>
            <th className='px-4 py-2 font-medium text-sm '>Usage</th>
          </tr>
        </thead>
        <tbody>
          {commands.map((command, index) => (
            <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : ''}>
              <td className='border px-4 py-2'>{command.name}</td>
              <td className='border px-4 py-2'>
                {command.params.join(', ') === ''
                  ? '-'
                  : command.params.join(', ')}
              </td>
              <td className='border px-4 py-2'>
                {command.flags.join(', ') === ''
                  ? '-'
                  : command.flags.join(', ')}
              </td>
              <td className='border px-4 py-2'>{command.description}</td>
              <td className='border px-4 py-2'>
                <pre className='font-mono'>{command.usage}</pre>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
