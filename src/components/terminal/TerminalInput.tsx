import React from 'react';

import { db } from '~/lib/db';
import { useTerminal } from '~/lib/hooks';
import { useTerminalStore } from '~/lib/stores';

import { Textarea } from '~/components/ui/textarea';

const TerminalInput = React.forwardRef<HTMLTextAreaElement, {}>(
  (_props, ref) => {
    const { text, setText, executing } = useTerminalStore();
    const { handleCommand, commandIdx, setCommandIdx } = useTerminal();

    const handleTextChange = (
      event: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
      setText(event.target.value);
    };

    const calculateTextAreaHeight = () => {
      const rows = text.split('\n').length;
      const minHeight = 24;
      const rowHeight = 24;
      return `${Math.max(minHeight, rows * rowHeight)}px`;
    };

    const handleKeyPress = async (
      event: React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
      if (
        event.key === 'Enter' &&
        !event.shiftKey &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.metaKey
      ) {
        event.preventDefault();
        await handleCommand();
      } else if (event.key === 'Enter' && event.shiftKey) {
        const newText = text + '\n';
        setText(newText);
        event.preventDefault();
        // now handle arrow up and down events
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        event.preventDefault();
        const commands = await db.results
          .where({ type: 'command' })
          .reverse()
          .toArray();

        if (commands.length === 0) return;

        let newIndex: number;

        if (event.key === 'ArrowUp') {
          newIndex = commandIdx + 1;
        } else {
          newIndex = commandIdx - 1;
        }

        if (newIndex >= commands.length || newIndex < 0) return;

        setCommandIdx(newIndex);

        const command = commands[newIndex];
        if (command.type === 'command') {
          setText(command.command);
        }
      }
    };

    return (
      <div className='flex flex-row items-start gap-1 text-base font-mono'>
        <div className='text-blue-600'>aos&gt;</div>
        <Textarea
          ref={ref}
          autoFocus
          value={text}
          disabled={executing}
          onChange={handleTextChange}
          className='w-full text-base p-0 rounded-none resize-none border-none'
          spellCheck={false}
          onKeyDown={handleKeyPress}
          style={{ height: calculateTextAreaHeight() }}
        />
      </div>
    );
  }
);

export default TerminalInput;
