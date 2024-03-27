import { useMessagesPanel } from '~/lib/stores/messages';

import Terminal from '../terminal';
import OutputBox from './output';
import Toolbar from './toolbar';

const Messages = () => {
  const { activeKey } = useMessagesPanel();
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
