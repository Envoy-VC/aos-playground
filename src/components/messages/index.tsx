import React from 'react';
import { useQuery } from 'react-query';
import { results } from '@permaweb/aoconnect';

import Ansi from 'ansi-to-react';

import { ScrollArea } from '~/components/ui/scroll-area';
import type { AoResult, AoResults } from '~/types';

import { Process } from '~/lib/db';
import { useLocalStorage } from 'usehooks-ts';
import { Button } from '../ui/button';
import { ArrowDownToLine } from 'lucide-react';

const Messages = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeProcess] = useLocalStorage<Process | undefined>(
    'activeProcess',
    undefined
  );

  const [rerender, setRerender] = React.useState<boolean>(false);
  const [isFirstRender, setIsFirstRender] = React.useState<boolean>(false);

  const { data } = useQuery<AoResult[]>(
    ['messages', activeProcess],
    async () => {
      if (!activeProcess) return [];
      const newMessages = (await results({
        process: activeProcess?.id ?? '',
        limit: 100,
        sort: 'ASC',
      })) as AoResults;
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

  const [isUserNearBottom, setIsUserNearBottom] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    const contentNode = containerRef.current;

    if (!contentNode) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = contentNode;

      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
      setIsUserNearBottom(isNearBottom);
    };

    contentNode.addEventListener('scroll', handleScroll);

    return () => {
      contentNode.removeEventListener('scroll', handleScroll);
    };
  }, []);

  React.useEffect(() => {
    const contentNode = containerRef.current;

    if (!contentNode) return;
    if (isUserNearBottom) contentNode.scrollTop = contentNode.scrollHeight;
  }, [rerender]);

  React.useEffect(() => {
    if (isFirstRender) {
      const contentNode = containerRef.current;
      if (contentNode) {
        contentNode.scrollTop = contentNode.scrollHeight;
      }
    }
  }, [isFirstRender]);

  return (
    <div className='relative h-full'>
      <div className=' h-full overflow-y-scroll px-4 py-2' ref={containerRef}>
        <div className='overflow-scroll'>
          {(data ?? []).map((e, i) => {
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
      {!isUserNearBottom && (
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

export default Messages;
