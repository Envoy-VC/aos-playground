import { useMessagesPanel } from '~/lib/stores/messages';

import OutputBox from './output';
import Toolbar from './toolbar';

const Messages = () => {
  const { activeKey } = useMessagesPanel();
  return (
    <>
      <div className='relative h-full'>
        <Toolbar />
        {activeKey === 'output' && <OutputBox />}
      </div>
    </>
  );
};

export default Messages;
