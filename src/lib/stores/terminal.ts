import { create } from 'zustand';

type State = {
  text: string;
  executing: boolean;
};

interface Actions {
  setText: (text: string) => void;
  setIsExecuting: (isExecuting: boolean) => void;
}

export const useTerminalStore = create<State & Actions>((set) => ({
  text: '',
  executing: false,
  setText: (text) => set({ text }),
  setIsExecuting: (executing) => set({ executing }),
}));
