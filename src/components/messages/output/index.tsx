import React from 'react';
import { useQuery } from 'react-query';
import { results } from '@permaweb/aoconnect';

import Ansi from 'ansi-to-react';

import type { AoResult, AoResults } from '~/types';

import { AoResultWithProcess, Process, db } from '~/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { useLocalStorage } from 'usehooks-ts';
import { Button } from '~/components/ui/button';
import { ArrowDownToLine } from 'lucide-react';

const OutputBox = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeProcess] = useLocalStorage<Process | undefined>(
    'activeProcess',
    undefined
  );

  const messages = useLiveQuery(async () => {
    if (!activeProcess) return [];
    const results = await db.results
      .where('process')
      .equals(activeProcess.id)
      .reverse()
      .toArray();
    return results;
  }, [activeProcess]);

  const [rerender, setRerender] = React.useState<boolean>(false);
  const [isFirstRender, setIsFirstRender] = React.useState<boolean>(false);

  useQuery<AoResult[]>(
    ['messages', activeProcess],
    async () => {
      if (!activeProcess) return [];
      const newMessages = (await results({
        process: activeProcess.id,
        limit: 100,
        sort: 'DESC',
      })) as AoResults;
      const resultsWithProcesses: AoResultWithProcess[] = [];
      for (const result of newMessages.edges) {
        resultsWithProcesses.push({
          ...result,
          process: activeProcess.id,
        });
      }

      try {
        await db.results.bulkPut(resultsWithProcesses, { allKeys: true });
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

  const [isUserNearTop, setIsUserNearTop] = React.useState<boolean>(false);

  React.useEffect(() => {
    const contentNode = containerRef.current;

    if (!contentNode) return;

    const handleScroll = () => {
      const { scrollTop } = contentNode;

      const isNearTop = scrollTop < 200;
      setIsUserNearTop(isNearTop);
    };

    contentNode.addEventListener('scroll', handleScroll);

    return () => {
      contentNode.removeEventListener('scroll', handleScroll);
    };
  }, []);

  React.useEffect(() => {
    const contentNode = containerRef.current;

    if (!contentNode) return;
    if (isUserNearTop) {
      contentNode.scrollTop = 0;
    }
  }, [rerender]);

  React.useEffect(() => {
    if (isFirstRender) {
      const contentNode = containerRef.current;
      if (contentNode) {
        contentNode.scrollTop = 0;
      }
    }
  }, [isFirstRender]);

  return (
    <div className='h-full'>
      <div className='h-full overflow-y-scroll px-4' ref={containerRef}>
        <div className='overflow-scroll'>
          {(messages ?? []).map((e, i) => {
            const res = e.node.Output.data;
            const data = typeof res === 'string' ? res : res.output;
            return (
              <div key={i}>
                aos&gt;{` `}
                <Ansi className=' whitespace-pre-line'>{String(data)}</Ansi>
              </div>
            );
          })}
        </div>
      </div>
      {!isUserNearTop && (
        <Button
          variant='secondary'
          className='absolute bottom-4 right-4 !m-0 h-8 w-8 !rounded-full !p-0'
          onClick={() => {
            const contentNode = containerRef.current;
            if (contentNode) {
              contentNode.scrollTop = contentNode.scrollHeight;
            }
          }}
        >
          <ArrowDownToLine size={18} />
        </Button>
      )}
    </div>
  );
};

export default OutputBox;
