import React from 'react';

import { AOSHelp } from '~/components/terminal/Commands';

import { db } from '../db';
import { safeRenderToString } from '../helpers/rehype';
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

  const [commandIdx, setCommandIdx] = React.useState<number>(-1);

  const [lastCursor, setLastCursor] = useLocalStorage<number>('lastCursor', 0);

  const { activeProcess } = useProcess();
  const { defaultTags } = useTags();

  const handleCommand = async () => {
    try {
      if (!activeProcess) {
        throw new Error('No active process');
      }

      if (text.startsWith('aos')) {
        const string = safeRenderToString(<AOSHelp />);
        await db.results.put({
          type: 'command',
          cursor: crypto.randomUUID(),
          command: string,
          process: activeProcess.id,
        });
      } else if (text === 'clear') {
        // TODO: handle clear
        const last = await db.results.count();
        setLastCursor(last);
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
