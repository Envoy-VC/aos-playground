import { create } from 'zustand';

type State = {
  text: string;
  executing: boolean;
  refocus: boolean;
};

interface Actions {
  setText: (text: string) => void;
  setIsExecuting: (isExecuting: boolean) => void;
  setRefocus: (refocus: boolean) => void;
}

export const useTerminalStore = create<State & Actions>((set) => ({
  text: '',
  executing: false,
  refocus: false,
  setText: (text) => set({ text }),
  setIsExecuting: (executing) => set({ executing }),
  setRefocus: (refocus) => set({ refocus }),
}));
