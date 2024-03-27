import { db } from '../db';
import { sendMessage } from '../services/message';
import { useTerminalStore } from '../stores';
import useProcess from './useProcess';
import useTags from './useTags';
import useToast from './useToast';

import { useActiveAddress } from 'arweave-wallet-kit';
import { useLocalStorage } from 'usehooks-ts';

const useTerminal = () => {
  const address = useActiveAddress();
  const { toast } = useToast();
  const { text, refocus, setText, setIsExecuting, setRefocus } =
    useTerminalStore();

  const [lastCursor, setLastCursor] = useLocalStorage<number>('lastCursor', 0);

  const { activeProcess } = useProcess();
  const { defaultTags } = useTags();

  const handleCommand = async () => {
    try {
      if (text.startsWith('aos')) {
        // TODO: handle aos commands
      } else if (text === 'clear') {
        // TODO: handle clear
        const last = await db.results.count();
        setLastCursor(last);
      } else {
        setIsExecuting(true);
        if (!activeProcess) {
          throw new Error('No active process');
        }
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
  return { handleCommand, lastCursor, setLastCursor };
};

export default useTerminal;
