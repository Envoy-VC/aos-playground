import { create } from 'zustand';

import { toolbarItems } from '../data';

type Values = (typeof toolbarItems)[number]['key'];

type State = {
  activeKey: Values;
  isFirstRender: boolean;
  rerender: boolean;
};

interface Actions {
  setActiveKey: (activeKey: Values) => void;
  setIsFirstRender: (isFirstRender: boolean) => void;
  setRerender: (rerender: boolean) => void;
}

export const useMessagesPanel = create<State & Actions>((set) => ({
  activeKey: 'output',
  isFirstRender: false,
  rerender: false,
  setActiveKey: (activeKey) => set({ activeKey }),
  setIsFirstRender: (isFirstRender) => set({ isFirstRender }),
  setRerender: (rerender) => set({ rerender }),
}));
