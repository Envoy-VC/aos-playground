import { create } from 'zustand';

import { sidebarItems } from '~/components/sidebar';
import { ImperativePanelHandle } from 'react-resizable-panels';

type Values = (typeof sidebarItems)[number]['key'];

type State = {
  activeKey: Values;
  panel: ImperativePanelHandle | null;
};

interface Actions {
  setActiveKey: (activeKey: Values) => void;
  setPanel: (panel: ImperativePanelHandle) => void;
}

export const useSidebar = create<State & Actions>((set, get) => ({
  activeKey: 'files',
  panel: null,
  setActiveKey: (activeKey) => set({ activeKey }),
  setPanel: (panel) => set({ panel }),
}));
