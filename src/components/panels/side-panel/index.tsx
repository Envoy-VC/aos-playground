import {
  ExplorerPanel,
  ProcessPanel,
  RunDebugPanel,
} from '~/components/sidebar-panels';

import { useSidebar } from '~/lib/stores';

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
