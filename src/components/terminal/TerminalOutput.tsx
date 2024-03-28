
import { db } from '~/lib/db';
import { useProcess, useTerminal } from '~/lib/hooks';

import MessageRenderer from '../messages/output/MessageRenderer';

import { useLiveQuery } from 'dexie-react-hooks';



const TerminalOutput = () => {
  const { lastCursor } = useTerminal();
  const { activeProcess } = useProcess();

  const output = useLiveQuery(async () => {
    if (!activeProcess) return [];
    const results = await db.results
      .where('process')
      .anyOf(activeProcess.id, 'output')
      .and((x) => x.id! > lastCursor)
      .sortBy('id');

   

    return results;
  }, [lastCursor, activeProcess]);

  return (
    <div className='flex flex-col'>
      {(output ?? []).map((out, idx) => {
        if (out.type === 'command') {
          return (
            <MessageRenderer
              key={idx}
              message={out.command}
              prompt='aos&gt; '
            />
          );
        } else {
          const res = out.output.node.Output.data;
          const data =
            typeof res === 'string'
              ? res
              : res.output ?? res.json ?? 'undefined';
          return <MessageRenderer key={idx} message={data} prompt='' />;
        }
      })}
    </div>
  );
};

export default TerminalOutput;
