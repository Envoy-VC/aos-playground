import React from 'react';



import { db } from '~/lib/db';
import { useCommands, useProcess, useTags, useToast } from '~/lib/hooks';
import { sendMessage } from '~/lib/services/message';
import { useTerminalStore } from '~/lib/stores';



import { useActiveAddress } from 'arweave-wallet-kit';
import { useLocalStorage } from 'usehooks-ts';


const useTerminal = () => {
  const { commands } = useCommands();
  const address = useActiveAddress();
  const { toast } = useToast();
  const { text, refocus, setText, setIsExecuting, setRefocus } =
    useTerminalStore();

  const [commandIdx, setCommandIdx] = React.useState<number>(-1);

  const [lastCursor, setLastCursor] = useLocalStorage<number>('lastCursor', 0);

  const { activeProcess } = useProcess();
  const { defaultTags } = useTags();

  const handleCommand = async () => {
    try {
      if (!activeProcess) {
        throw new Error('No active process');
      }
      const t = text;

      const command = commands.filter((c) => t.startsWith(c.name)).at(0);

      if (command) {
        const args = t.replace(command.name, '').split(' ').slice(1);
        if (command.name !== 'clear') {
          await db.results.put({
            type: 'command',
            cursor: crypto.randomUUID(),
            command: text,
            process: activeProcess!.id,
          });
        }
        await command.handler(args, text);
      } else {
        setIsExecuting(true);
        await send();
        await db.results.put({
          type: 'command',
          cursor: crypto.randomUUID(),
          command: text,
          process: activeProcess.id,
        });
      }
    } catch (error) {
      toast.error({
        description: (error as Error).message,
      });
    } finally {
      setText('');
      setRefocus(!refocus);
      setIsExecuting(false);
      setCommandIdx(-1);
    }
  };

  const send = async () => {
    if (!activeProcess) {
      throw new Error('No active process');
    }
    if (!address) {
      throw new Error('Connect Arweave Wallet to send messages');
    }

    await sendMessage({
      data: text,
      process: activeProcess.id,
      tags: defaultTags,
    });
  };
  return {
    handleCommand,
    lastCursor,
    setLastCursor,
    commandIdx,
    setCommandIdx,
  };
};

export default useTerminal;