import React from 'react';

import { useTerminalStore } from '~/lib/stores';
import { useMessagesPanel } from '~/lib/stores/messages';

import { Button } from '~/components/ui/button';

import CommandLoading from './CommandLoading';
import TerminalInput from './TerminalInput';
import TerminalOutput from './TerminalOutput';

import { ArrowDownToLine } from 'lucide-react';
import { useEventListener } from 'usehooks-ts';

const Terminal = () => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const [isNearBottom, setIsNearBottom] = React.useState<boolean>(false);
  const { rerender, isFirstRender } = useMessagesPanel();
  const { refocus } = useTerminalStore();

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [refocus]);

  useEventListener('click', handleClick, containerRef);

  React.useEffect(() => {
    const contentNode = containerRef.current;

    if (!contentNode) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = contentNode;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 400;
      setIsNearBottom(isNearBottom);
    };

    contentNode.addEventListener('scroll', handleScroll);

    return () => {
      contentNode.removeEventListener('scroll', handleScroll);
    };
  }, []);

  React.useEffect(() => {
    const contentNode = containerRef.current;

    if (!contentNode) return;
    if (isNearBottom) {
      contentNode.scrollTop = contentNode.scrollHeight;
    }
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
    <div
      className='h-full p-2 font-mono overflow-y-scroll pb-12'
      ref={containerRef}
    >
      <div>Welcome message</div>
      <TerminalOutput />
      <TerminalInput ref={inputRef} />
      <CommandLoading />
      {!isNearBottom && (
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

export default Terminal;
