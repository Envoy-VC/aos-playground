import { sendMessage } from '../services/message';
import { useTerminalStore } from '../stores';
import useProcess from './useProcess';
import useTags from './useTags';
import useToast from './useToast';

import { useActiveAddress } from 'arweave-wallet-kit';

const useTerminal = () => {
  const address = useActiveAddress();
  const { toast } = useToast();
  const { text, setText, setIsExecuting } = useTerminalStore();

  const { activeProcess } = useProcess();
  const { defaultTags } = useTags();

  const handleCommand = async () => {
    try {
      setIsExecuting(true);
      if (text.startsWith('aos')) {
        // handle other things
      } else {
        await send();
      }
    } catch (error) {
      toast.error({
        description: (error as Error).message,
      });
    } finally {
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

    setText('');
  };
  return { handleCommand };
};

export default useTerminal;
