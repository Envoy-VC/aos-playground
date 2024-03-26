import { useSidebar } from '~/lib/stores';

import {
  ExplorerPanel,
  ProcessPanel,
  RunDebugPanel,
} from '~/components/sidebar-panels';

const SidePanel = () => {
  const { activeKey } = useSidebar();
  return (
    <>
      {activeKey === 'processes' && <ProcessPanel />}
      {activeKey === 'files' && <ExplorerPanel />}
      {activeKey === 'run' && <RunDebugPanel />}
    </>
  );
};

export default SidePanel;
