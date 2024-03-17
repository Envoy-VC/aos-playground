import { useQuery } from 'react-query';
import { results } from '@permaweb/aoconnect';

import Ansi from 'ansi-to-react';

import { ScrollArea } from '~/components/ui/scroll-area';

import type { AoResults } from '~/types';

import { db } from '~/lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

const Messages = () => {
  const activeProcess = useLiveQuery(async () => {
    const activeProcess = (await db.activeProcess.toArray()).at(0);
    return activeProcess;
  }, []);

  const { data } = useQuery<AoResults>(
    'messages',
    async () => {
      const newMessages = await results({
        process:
          activeProcess?.id ?? '5SGJUlPwlenkyuG9-xWh0Rcf0azm8XEd5RBTiutgWAg',
        limit: 100,
        sort: 'ASC',
      });
      return newMessages;
    },
    {
      refetchInterval: 5000,
    }
  );
  if (data)
    return (
      <ScrollArea className='h-full px-4 pt-2'>
        <div className='overflow-scroll'>
          {data.edges.map((e) => {
            const res = e.node.Output.data;
            const data = typeof res === 'string' ? res : res.output;
            return (
              <div>
                aos&gt;{'\t'}
                <Ansi className=' whitespace-pre-line'>{String(data)}</Ansi>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    );
};

export default Messages;
