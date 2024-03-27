import { useQuery } from 'react-query';

import { db } from '~/lib/db';
import { useProcess } from '~/lib/hooks';
import { useMessagesPanel } from '~/lib/stores/messages';

import { results } from '@permaweb/aoconnect';
import { AoResult, AoResults, Result } from '~/types';

import Terminal from '../terminal';
import OutputBox from './output';
import Toolbar from './toolbar';

const Messages = () => {
  const { activeKey, isFirstRender, rerender, setIsFirstRender, setRerender } =
    useMessagesPanel();
  const { activeProcess } = useProcess();

  useQuery<AoResult[]>(
    ['messages', activeProcess],
    async () => {
      if (!activeProcess) return [];
      const newMessages = (await results({
        process: activeProcess.id,
        limit: 100,
        sort: 'DESC',
      })) as AoResults;

      const outputs: Result[] = [];

      for (const result of newMessages.edges) {
        outputs.push({
          type: 'output',
          output: result,
          cursor: result.cursor,
          process: activeProcess.id,
        });
      }

      try {
        await db.results.bulkPut(outputs, { allKeys: true });
      } catch (error) {}
      if (!isFirstRender) {
        setIsFirstRender(true);
      }
      setRerender(!rerender);
      return newMessages.edges;
    },
    {
      refetchInterval: 3000,
    }
  );
  return (
    <>
      <div className='relative h-full'>
        <Toolbar />
        {activeKey === 'output' && <OutputBox />}
        {activeKey === 'terminal' && <Terminal />}
      </div>
    </>
  );
};

export default Messages;
