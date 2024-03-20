import { create } from 'zustand';

import { RequireFile } from '../helpers/ast-parser';

type State = {
  isActive: boolean;
  filePath: string | undefined;
  result: RequireFile[];
};

interface Actions {
  setIsActive(isActive: boolean): void;
  setFilePath: (activeKey: string | undefined) => void;
  setResult: (res: RequireFile[]) => void;
}

export const useDebugFile = create<State & Actions>((set) => ({
  filePath: undefined,
  isActive: false,
  result: [],
  setFilePath: (filePath) => set({ filePath }),
  setIsActive: (isActive) => set({ isActive }),
  setResult: (result) => set({ result }),
}));
