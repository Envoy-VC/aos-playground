import { useSidebar } from '~/lib/stores';

import {
  ExplorerPanel,
  ProcessPanel,
  RunDebugPanel,
  SettingsPanel,
} from '~/components/sidebar-panels';

const SidePanel = () => {
  const { activeKey } = useSidebar();
  return (
    <>
      {activeKey === 'files' && <ExplorerPanel />}
      {activeKey === 'processes' && <ProcessPanel />}
      {activeKey === 'run' && <RunDebugPanel />}
      {activeKey === 'settings' && <SettingsPanel />}
    </>
  );
};

export default SidePanel;
