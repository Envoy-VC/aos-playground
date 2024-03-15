import { useReadLocalStorage } from 'usehooks-ts';
import { useQuery } from 'react-query';
import { results } from '@permaweb/aoconnect';

import Ansi from 'ansi-to-react';

import { ScrollArea } from '~/components/ui/scroll-area';

import type { AoResults, Process } from '~/types';

const Messages = () => {
  const activeProcess = useReadLocalStorage<Process | null>('activeProcess');

  const { data } = useQuery<AoResults>(
    'messages',
    async () => {
      const newMessages = await results({
        process:
          activeProcess?.txId ?? '5SGJUlPwlenkyuG9-xWh0Rcf0azm8XEd5RBTiutgWAg',
        limit: 100,
        sort: 'ASC',
      });
      console.log(newMessages);
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
