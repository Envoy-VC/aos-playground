import { useMessagesPanel } from '~/lib/stores/messages';

import Toolbar from './toolbar';
import OutputBox from './output';

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
