import { create } from 'zustand';

import { toolbarItems } from '../data';

type Values = (typeof toolbarItems)[number]['key'];

type State = {
  activeKey: Values;
};

interface Actions {
  setActiveKey: (activeKey: Values) => void;
}

export const useMessagesPanel = create<State & Actions>((set) => ({
  activeKey: 'output',
  setActiveKey: (activeKey) => set({ activeKey }),
}));
