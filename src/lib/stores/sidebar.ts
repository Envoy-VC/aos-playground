import { ImperativePanelHandle } from 'react-resizable-panels';

import { create } from 'zustand';

import { sidebarItems } from '../data';

type Values = (typeof sidebarItems)[number]['key'];

type State = {
  activeKey: Values;
  panel: ImperativePanelHandle | null;
  isCollapsed: boolean;
};

interface Actions {
  setActiveKey: (activeKey: Values) => void;
  setPanel: (panel: ImperativePanelHandle) => void;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export const useSidebar = create<State & Actions>((set) => ({
  activeKey: 'files',
  panel: null,
  isCollapsed: false,
  setActiveKey: (activeKey) => set({ activeKey }),
  setPanel: (panel) => set({ panel }),
  setIsCollapsed: (isCollapsed) => set({ isCollapsed }),
}));
