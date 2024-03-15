import { create } from 'zustand';

import { sidebarItems } from '~/components/sidebar';

type Values = (typeof sidebarItems)[number]['key'];

type State = {
  activeKey: Values;
  isOpen: boolean;
};

interface Actions {
  setActiveKey: (activeKey: Values) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useSidebar = create<State & Actions>((set) => ({
  activeKey: 'files',
  isOpen: true,
  setActiveKey: (activeKey) => set({ activeKey }),
  setIsOpen: (isOpen) => set({ isOpen }),
}));
