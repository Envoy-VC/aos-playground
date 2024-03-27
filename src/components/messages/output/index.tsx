import React from 'react';

import { db } from '~/lib/db';
import { useProcess } from '~/lib/hooks';
import { useMessagesPanel } from '~/lib/stores/messages';

import { Button } from '~/components/ui/button';

import MessageRenderer from './MessageRenderer';

import { useLiveQuery } from 'dexie-react-hooks';
import { ArrowUpToLine } from 'lucide-react';

const OutputBox = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { rerender, isFirstRender } = useMessagesPanel();

  const { activeProcess } = useProcess();

  const messages = useLiveQuery(async () => {
    if (!activeProcess) return [];
    const results = await db.results
      .where({
        process: activeProcess.id,
        type: 'output',
      })
      .reverse()
      .toArray();
    return results;
  }, [activeProcess]);

  const [isUserNearTop, setIsUserNearTop] = React.useState<boolean>(true);

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
            if (e.type === 'output') {
              const res = e.output.node.Output.data;
              const data = typeof res === 'string' ? res : res.output;
              return (
                <MessageRenderer key={i} message={data} prompt='aos&gt; ' />
              );
            }
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
              contentNode.scrollTop = 0;
            }
          }}
        >
          <ArrowUpToLine size={18} />
        </Button>
      )}
    </div>
  );
};

export default OutputBox;
