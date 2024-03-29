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
  const { activeProcess, setActiveProcess } = useProcess();
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
    {
      name: 'aos set-active',
      params: ['pid'],
      flags: [],
      description: 'Sets the active process in the Playground',
      usage: 'aos set-active <process_id>',
      handler: async (args) => {
        const processId = args[0];
        const processes = await db.processes.toArray();
        const process = processes.find((p) => p.id === processId);
        if (!process) {
          throw new Error(`Process ${processId} not found, Import it first`);
        }
        setActiveProcess(process);
        toast.success({
          title: 'Active Process Set',
        });
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
    <div className='flex flex-col font-mono gap-4 max-w-screen-md select-text py-3 w-full'>
      <div className='flex flex-col text-base'>
        <div className='font-medium'>Version: 0.0.1</div>
        <div className='font-medium'>
          Usage: <span className='font-normal'>aos [command] [options]</span>
        </div>
      </div>

      <div className='flex flex-col w-full'>
        {commands
          .filter((c) => c.name.startsWith('aos'))
          .map((command) => (
            <div className='flex flex-row items-center'>
              <div className='basis-1/3 w-full'>
                <div className='flex flex-row items-center gap-1'>
                  <div>{command.name}</div>
                  <div className='text-blue-400'>
                    {command.params.join(' ')}
                  </div>
                </div>
              </div>
              <div className='basis-2/3 w-full'>
                <div>{command.description}</div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export const ProcessList = ({ processes }: { processes: Process[] }) => {
  return (
    <div className='flex flex-col gap-4 max-w-xl w-full font-mono'>
      <div className='flex flex-col text-base font-medium'>
        List of Imported Processes
      </div>
      <div className='flex flex-col w-full'>
        {processes.map((process) => (
          <div className='flex flex-row items-center'>
            <div className='basis-1/3 w-full'>
              <div>{process.name}</div>
            </div>
            <div className='basis-2/3 w-full'>
              <div>{process.id}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
