import { db } from '~/lib/db';
import { getRequireValuesFromAST } from '~/lib/helpers/ast-parser';
import { safeRenderToString } from '~/lib/helpers/rehype';
import { useProcess, useTags, useToast } from '~/lib/hooks';
import { sendMessage } from '~/lib/services/message';
import { useTerminalStore } from '~/lib/stores';

import { Process } from '~/types';

import { useLocalStorage } from 'usehooks-ts';

import { TerminalCommand } from '~/types/terminal';

export const useCommands = () => {
  const { toast } = useToast();
  const { activeProcess } = useProcess();
  const { defaultTags } = useTags();
  const { setIsExecuting } = useTerminalStore();
  const [, setLastCursor] = useLocalStorage<number>('lastCursor', 0);

  const commands: TerminalCommand[] = [
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
    {
      name: 'aos help',
      params: [],
      flags: [],
      description: 'Print help information about the AOS Terminal',
      usage: 'aos help',
      handler: async () => {
        printToConsole(<AOSHelp commands={commands} />);
      },
    },
    {
      name: 'aos load',
      params: ['filePath'],
      flags: [],
      description: 'Sends the contents of the file.',
      usage: 'aos load /path/to/file',
      handler: async (args: string[]) => {
        try {
          setIsExecuting(true);
          if (!activeProcess) {
            return;
          }
          const filePath = args[0];

          const files = await getRequireValuesFromAST(filePath);
          const resolvedFiles = files.filter((f) => f.exists);

          const sequentialFiles = [...resolvedFiles].reverse();

          await Promise.all(
            sequentialFiles.map(async (file) => {
              try {
                await sendMessage({
                  process: activeProcess.id,
                  data: file.content,
                  tags: defaultTags,
                });
              } catch (error) {
                toast.error({
                  title: `Error processing file: ${file.filePath.slice(1)}`,
                  description: (error as Error).message,
                });
              }
            })
          );
        } finally {
          setIsExecuting(false);
        }
      },
    },
    {
      name: 'aos list',
      params: [],
      flags: [],
      description: 'Lists all the processes in the Playground',
      usage: 'aos list',
      handler: async () => {
        const processes = await db.processes.toArray();
        printToConsole(<ProcessList processes={processes} />);
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
    <div className='flex flex-col font-sans gap-4 max-w-screen-lg select-none py-3'>
      <div className='text-sm text-neutral-600 dark:text-neutral-300'>
        Here are some commands to get you started.
      </div>
      <table className='table-auto w-full border'>
        <thead>
          <tr>
            <th className='px-4 py-2 font-medium text-sm text-start'>Name</th>
            <th className='px-4 py-2 font-medium text-sm'>Parameters</th>
            <th className='px-4 py-2 font-medium text-sm '>Flags</th>
            <th className='px-4 py-2 font-medium text-sm '>Description</th>
            <th className='px-4 py-2 font-medium text-sm '>Usage</th>
          </tr>
        </thead>
        <tbody>
          {commands.map((command, index) => (
            <tr key={index}>
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

export const ProcessList = ({ processes }: { processes: Process[] }) => {
  return (
    <div className='flex flex-col gap-4 max-w-xl w-full'>
      <table className='table-auto w-full'>
        <tbody>
          {processes.map((process, index) => (
            <tr key={index}>
              <td className='py-2'>{process.name}</td>
              <td className='py-2'>
                {process.id.slice(0, 8)}...{process.id.slice(-8)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
